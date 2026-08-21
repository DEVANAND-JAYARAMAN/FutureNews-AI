import boto3
from datetime import datetime


REGION = "ap-south-1"

dynamodb = boto3.resource(
    "dynamodb",
    region_name=REGION
)


world_state_table = dynamodb.Table(
    "FutureNewsWorldState"
)


editions_table = dynamodb.Table(
    "FutureNewsEditions"
)


def get_world_state(
    world_id: str = "world-main"
) -> dict | None:
    """
    Load persistent world memory.
    """

    response = world_state_table.get_item(
        Key={
            "worldId": world_id
        }
    )

    return response.get("Item")


def get_all_editions() -> list[dict]:
    """
    Load all FutureNews editions.

    Note:
    This MVP uses scan() because the dataset is small.
    """

    response = editions_table.scan()

    editions = response.get("Items", [])

    editions.sort(
        key=lambda edition: int(
            edition.get(
                "editionNumber",
                0
            )
        )
    )

    return editions


def save_edition(
    edition: dict
) -> None:
    """
    Save a newly generated FutureNews edition.
    """

    editions_table.put_item(
        Item=edition
    )


def update_world_state(
    world_state: dict
) -> None:
    """
    Save updated persistent world memory.
    """

    world_state["updatedAt"] = (
        datetime.utcnow()
        .replace(microsecond=0)
        .isoformat()
        + "Z"
    )

    world_state_table.put_item(
        Item=world_state
    )