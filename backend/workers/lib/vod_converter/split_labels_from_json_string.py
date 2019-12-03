import collections
import json
import math
import sys


def split_coco_labels(json_string, max_byte_size):
    """
    Splitting input json string into smaller json strings
    :param json_string: JSON string (decoded)
    :param max_byte_size: Approximate size of single json string, final size depends on number of annotations for images
                        in current string, so it would be good to leave some reserve
    :return: List of json strings containing splitted to smaller pieces input string
    """

    total_json_size = sys.getsizeof(json_string)
    number_of_chunks = int(math.ceil(total_json_size / max_byte_size))
    json_dict = json.loads(json_string)

    images = json_dict['images']
    img_chunk_size = int(len(images) / number_of_chunks)

    print(f"Splitting {len(images)} images to substrings with {img_chunk_size} images per string")

    image_chunks = [images[i * img_chunk_size: (i + 1) * img_chunk_size] for i in range(number_of_chunks)]
    image_chunks.append(images[number_of_chunks * img_chunk_size:])

    print("Splitting annotations")
    annotations_base = collections.defaultdict(list)
    for annotation in json_dict['annotations']:
        annotations_base[annotation['image_id']].append(annotation)

    print(f"Creating {number_of_chunks + 1} json substrings")
    splitted_labels = []
    for i in range(number_of_chunks + 1):
        splitted_labels.append(json.dumps(
            {"images": image_chunks[i],
             'categories': json_dict['categories'],
             'annotations': [annotation for img in image_chunks[i] for annotation in annotations_base[img['id']]]}))
        print(f"Created JSON substring nr {i}")

    return splitted_labels
