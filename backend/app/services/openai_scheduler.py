# app/services/openai_scheduler.py
import os
import json
import logging
from typing import List, Dict

from dotenv import load_dotenv
import openai

from app.models import ScheduleItem

# Load environment variables (including OPENAI_API_KEY)
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# Configure basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def schedule_with_chatgpt(tasks: List[Dict]) -> List[ScheduleItem]:
    """
    Generate a procrastination schedule for tomorrow, between 09:00 and 22:00.

    This function sends your task list to ChatGPT (gpt-4o-mini) with a function
    schema instructing it to:
      - Place fixed tasks at their specified times.
      - Fill remaining gaps with flexible tasks.
      - Introduce long breaks to maximize unproductivity.
      - Account for travel time between events.
      - Split tasks into smaller chunks where appropriate.
      - Ensure all tasks fit within the 9am–10pm window.

    Args:
        tasks: A list of dicts matching Task.dict(), e.g.:
            [
                {
                    "name": "Write essay",
                    "length": 2.0,
                    "location": "Home",
                    "intensity": "Medium",
                    "flexible": true,
                    "start": null
                },
                {
                    "name": "Meeting",
                    "length": 1.0,
                    "location": "Office",
                    "intensity": "Medium",
                    "flexible": false,
                    "start": "15:30"
                },
                ...
            ]

    Returns:
        A list of ScheduleItem instances, parsed and validated via Pydantic.
    """
    # Define the function schema to send to ChatGPT
    functions = [
        {
            "name": "generate_procrastination_schedule",
            "description": (
                "Return a tomorrow‐dated schedule from 09:00 to 22:00, placing fixed tasks at their times "
                "and filling gaps with flexible tasks. Aim to maximize procrastination by introducing long breaks, "
                "accounting for travel between events, and splitting tasks into smaller chunks as needed. "
                "All events must fit within 09:00–22:00, and every task must appear."
                 "accounting for travel between events, and splitting flexible tasks into smaller  "
                "chunks as to waste the must time. All events MUST fit within 09:00–22:00, and every task must appear."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "schedule": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "name":      {"type": "string"},
                                "start":     {"type": "string", "description": "HH:MM format"},
                                "end":       {"type": "string", "description": "HH:MM format"},
                                "length":    {"type": "number", "description": "Duration in hours"},
                                "location":  {"type": "string"},
                                "intensity": {"type": "string"},
                                "flexible":  {"type": "boolean"},
                                "order":     {"type": "integer"}
                            },
                            "required": [
                                "name", "start", "end",
                                "length", "location",
                                "intensity", "flexible", "order"
                            ]
                        }
                    }
                },
                "required": ["schedule"]
            }
        }
    ]

    # Build the chat messages
    messages = [
        {
            "role": "system",
            "content": "You are an assistant that creates hilariously unproductive schedules."
        },
        {
            "role": "user",
            "content": f"Here are my tasks for tomorrow:\n\n{json.dumps(tasks, indent=2)}"
        }
    ]

    # Call the ChatCompletion API
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=messages,
            functions=functions,
            function_call={"name": "generate_procrastination_schedule"},
            temperature=0.7,
            max_tokens=1000,
        )
    except openai.OpenAIError as e:
        logger.error("OpenAI API error: %s", e)
        raise

    # Extract the function call arguments
    choice = response.choices[0].message
    if choice.get("function_call") is None:
        logger.error("Expected a function_call in response but none found.")
        raise RuntimeError("ChatGPT did not return a function_call.")

    func_args = json.loads(choice["function_call"]["arguments"])
    raw_schedule = func_args.get("schedule", [])

    logger.info("ChatGPT returned %d schedule items", len(raw_schedule))

    # Parse and validate via Pydantic
    schedule_items = []
    for idx, item in enumerate(raw_schedule, start=1):
        try:
            schedule_items.append(ScheduleItem.parse_obj(item))
        except Exception as e:
            logger.error("Failed to parse schedule item %d: %s", idx, e)
            raise

    return schedule_items
