import json
from datetime import datetime


def build_review_prompt(
    memory_context: dict,
    generated_event: dict
) -> str:
    """
    Build the prompt used by the AI to review
    a generated event.
    """

    prompt = f"""
You are the self-review system for FutureNews AI.

Your job is to evaluate a proposed news event before
it becomes part of the persistent fictional world.

CURRENT WORLD MEMORY:

{json.dumps(memory_context, indent=2)}

PROPOSED EVENT:

{json.dumps(generated_event, indent=2)}

Review the proposed event using these criteria:

1. DATE CONSISTENCY
   - The event date must be after the current fictional date.

2. STORY CONSISTENCY
   - The event must not contradict established facts.
   - The event should logically follow the existing world.

3. NOVELTY
   - The event must not repeat a recent edition.
   - It should introduce a meaningful development.

4. FUTURE POTENTIAL
   - The event should create consequences or possibilities
     for future editions.

5. CREATIVITY
   - The event should be interesting and believable within
     this fictional future world.

Return ONLY valid JSON:

{{
  "approved": false,
  "score": 0,
  "issues": [],
  "feedback": ""
}}
"""

    return prompt.strip()


def validate_event_date(
    current_future_date: str,
    event_date: str
) -> dict:
    """
    Perform deterministic date validation outside
    the AI model.
    """

    try:
        current_date = datetime.strptime(
            current_future_date,
            "%Y-%m-%d"
        ).date()

        proposed_date = datetime.strptime(
            event_date,
            "%Y-%m-%d"
        ).date()

        if proposed_date <= current_date:
            return {
                "valid": False,
                "issue": (
                    "The proposed event date must be after "
                    "the current fictional date."
                )
            }

        return {
            "valid": True,
            "issue": None
        }

    except ValueError:
        return {
            "valid": False,
            "issue": (
                "Invalid date format. "
                "Use YYYY-MM-DD."
            )
        }


def parse_review_response(
    response_text: str
) -> dict:
    """
    Convert the AI review JSON response
    into a Python dictionary.
    """

    cleaned_response = response_text.strip()

    if cleaned_response.startswith("```json"):
        cleaned_response = cleaned_response.replace(
            "```json",
            "",
            1
        )

    if cleaned_response.startswith("```"):
        cleaned_response = cleaned_response.replace(
            "```",
            "",
            1
        )

    if cleaned_response.endswith("```"):
        cleaned_response = cleaned_response[:-3]

    return json.loads(cleaned_response.strip())


def should_revise(
    date_validation: dict,
    ai_review: dict,
    minimum_score: int = 7
) -> bool:
    """
    Decide whether the generated event
    needs revision.
    """

    if not date_validation.get("valid", False):
        return True

    if not ai_review.get("approved", False):
        return True

    if ai_review.get("score", 0) < minimum_score:
        return True

    return False