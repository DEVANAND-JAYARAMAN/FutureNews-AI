from decimal import Decimal


def convert_decimals(value):
    """
    Recursively convert DynamoDB Decimal values into
    plain int/float so downstream code (e.g. json.dumps
    calls that build Bedrock prompts) can serialize them.
    """

    if isinstance(value, Decimal):
        if value % 1 == 0:
            return int(value)
        return float(value)

    elif isinstance(value, dict):
        return {
            key: convert_decimals(val)
            for key, val in value.items()
        }

    elif isinstance(value, list):
        return [
            convert_decimals(item)
            for item in value
        ]

    return value
