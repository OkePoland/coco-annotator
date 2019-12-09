"""
Dict with labels and aliases which will be imported to every Egestor
If you want to convert mismatched labels in ingested datasets just add their labels as proper aliases for labels below

CityCam Labels
taxi, 1
black sedan, 2
other cars, 3
little truck, 4
middle truck, 5
big truck,  6
van, 7
middle bus, 8
big bus, 9
other vehicles 10

"""

# "output_label": [list_of_aliases]
output_labels = {
    "person": ["pedestrian", "person_sitting", "person"],
    "people": ["pedestrians"],
    "wheelchair": ["wheelchairuser"],
    "bicycle": ["cyclist", "biker", "tricyclist"],
    "car": ["van", "1", "2", "3", "7"],
    "motorcycle": ["motorbike", "mopedrider", "motorcyclist"],
    "aeroplane": [],
    "bus": ["8", "9"],
    "train": [],
    "tram": [],
    "truck": ["4", "5", "6"],
    "boat": [],
    "traffic light": [],
    "fire hydrant": [],
    "stop sign": [],
    "parking meter": [],
    "bench": [],
    "bird": [],
    "cat": [],
    "dog": [],
    "sports": [],
    "horse": [],
    "sheep": [],
    "cow": [],
    "elephant": [],
    "bear": [],
    "zebra": [],
    "giraffe": [],
    "bottle": [],
    "chair": [],
    "dining table": ["diningtable"],
    "potted plant": ["pottedplant"],
    "sofa": [],
    "tvmonitor": ["tv/monitor"],
    "non_motorized_vehicle": ["10"],
}
