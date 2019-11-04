"""
Converts between visual object detection dataset formats. See `converter.py` for more info.

To add support for additional data formats, define a module with an `converter.Ingestor` and/or
`converter.Egestor` implementation and add them to the `INGESTORS` and `EGESTORS` dicts below.
"""

import argparse
import logging
import sys

import lib.vod_converter.converter as converter
import lib.vod_converter.kitti as kitti
import lib.vod_converter.kitti_tracking as kitti_tracking
import lib.vod_converter.coco as coco
import lib.vod_converter.voc as voc
import lib.vod_converter.caltech as caltech

logger = logging.getLogger('gunicorn.error')
logger.setLevel(logging.INFO)

INGESTORS = {
    'coco': coco.COCOIngestor,
    'kitti': kitti.KITTIIngestor(),
    'kitti-tracking': kitti_tracking.KITTITrackingIngestor(),
    'voc': voc.VOCIngestor(), 
    'caltech': caltech.CaltechIngestor(), }


EGESTORS = {
    'voc': voc.VOCEgestor(),
    'kitti': kitti.KITTIEgestor(),
    'coco': coco.COCOEgestor()

}


def main(*, from_path, from_key, to_path, to_key):
    success, msg = converter.convert(from_path=from_path, ingestor_key=from_key,
                                     to_path=to_path, egestor_key=to_key,
                                     select_only_known_labels=False,
                                     filter_images_without_labels=True, folder_names=None)
    if success:
        print(f"Successfully converted from {from_key} to {to_key}.")
    else:
        print(f"Failed to convert from {from_key} to {to_key}: {msg}")
        return 1


def parse_args():
    parser = argparse.ArgumentParser(description='Convert visual object datasets.')
    parser._action_groups.pop()
    required = parser.add_argument_group('required arguments')
    optional = parser.add_argument_group('optional arguments')
    required.add_argument('--from',
                          dest='from_key',
                          required=True,
                          help=f'Format to convert from: one of {", ".join(INGESTORS.keys())}', type=str)
    required.add_argument('--from-path', dest='from_path',
                          required=True,
                          help=f'Path to dataset you wish to convert.', type=str)
    required.add_argument('--to', dest='to_key', required=True,
                          help=f'Format to convert to: one of {", ".join(EGESTORS.keys())}',
                          type=str)
    required.add_argument(
        '--to-path',
        dest='to_path', required=True,
        help="Path to output directory for converted dataset.", type=str)
    optional.add_argument(
        '--select-only-known-labels',
        help="only include labels known to the destination dataset (e.g skip 'trafficlight' if VOC doesn't know about it)",
        required=False,
        action='store_true',
        default=False
    )
    optional.add_argument(
        '--filter-images-without-labels',
        help="skip images that don't have any (known) labels",
        required=False,
        action='store_true',
        default=False
    )

    args = parser.parse_args()
    logging.info(args)
    return args


if __name__ == '__main__':
    args = parse_args()
    sys.exit(main(from_path=args.from_path, from_key=args.from_key,
                  to_path=args.to_path, to_key=args.to_key,
                  select_only_known_labels=args.select_only_known_labels,
                  filter_images_without_labels=args.filter_images_without_labels))
