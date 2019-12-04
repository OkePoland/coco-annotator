import argparse
import collections
import json
import os
import sys


def main(labels_to_split, output_dir, labels_per_file):
    os.makedirs(output_dir, exist_ok=True)

    with open(labels_to_split) as file:
        data = json.load(file)

    images = data["images"]
    chunk = int(len(images) / labels_per_file)
    print("Splitting images")
    image_chunks = [images[i * labels_per_file:(i + 1) * labels_per_file] for i in range(chunk)]
    image_chunks.append(images[chunk * labels_per_file:])

    print("Finding images id")

    print("Splitting annotations")
    annotations_base = collections.defaultdict(list)
    for annotation in data["annotations"]:
        annotations_base[annotation["image_id"]].append(annotation)

    print(f"Creating {chunk + 1} subjsons")
    for i in range(chunk + 1):
        print(f"Saving JSON file nr {i}")

        out = {"images": image_chunks[i],
               "categories": data["categories"],
               "annotations": [annotation for img in image_chunks[i] for annotation in annotations_base[img["id"]]]}

        with open(f"{output_dir}/splitted_labels_{i}.json", "w") as annotation_file:
            json.dump(out, annotation_file)


def parse_args():
    parser = argparse.ArgumentParser(description="Split JSON file with labels into smaller JSON files")
    parser.add_argument("--labels-to-split", "--labels", dest="labels_to_split",
                        required=True,
                        help=f"Path to JSON file with input labels", type=str)

    parser.add_argument(
        "--output-dir", "--dir",
        dest="output_dir", required=True,
        help="Path to output directory for JSON files obtained from splitting input JSON file.", type=str)

    parser.add_argument(
        "--nr-of-labels-per-file", "--nr",
        dest="nr_of_labels_per_file",
        help="How many labels per file in output JSON files",
        required=True, type=int)

    input_args = parser.parse_args()
    return input_args


if __name__ == "__main__":
    args = parse_args()
    sys.exit(
        main(labels_to_split=args.labels_to_split, output_dir=args.output_dir,
             labels_per_file=args.nr_of_labels_per_file))
