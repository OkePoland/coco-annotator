class Ingestor:
    def validate(self, path, folder_names):
        """
        Validate that a path contains files / directories expected for a given data format.

        This is where you can provide feedback to the end user if they are attempting to convert from
        your format but have passed you path to a directory that is missing the expected files or directory
        structure.

        :param path: Where the data is stored
        :return: (sucess, error message), e.g (False, "error message") if anything is awry, (True, None) otherwise.
        """
        return True, None

    def ingest(self, path, folder_names):
        """
        Read in data from the filesytem.
        :param path: '/path/to/data/'
        :return: an array of dicts conforming to `IMAGE_DETECTION_SCHEMA`
        """
        pass


class Egestor:

    def expected_labels(self):
        """
        Return a dict with a key for each label generally expected by this dataset format and
        any aliases that should be converted.

        In the example below the expected labels are 'car' and 'pedestrian' and, for example, both
        'Car' and 'auto' should be converted to 'car'.

        :return: {'car': ['Car', 'auto'], 'pedestrian': ['Person']}
        """
        raise NotImplementedError()

    def egest(self, *, image_detections, root, folder_names):
        """
        Output data to the filesystem.

        Note: image_detections will already have any conversions specified via `expected_labels` applied
        by the time they are passed to this method.

        :param image_detections: an array of dicts conforming to `IMAGE_DETECTION_SCHEMA`
        :param root: '/path/to/output/data/'
        """
        raise NotImplementedError()


class DataConversionException(Exception):
    pass