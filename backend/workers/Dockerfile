FROM tantael/multi-annotator:python-env

WORKDIR /workspace/

# Install python package dependices
COPY ./backend/ /workspace/

RUN python -m pip --version

EXPOSE 5555
CMD celery -A workers worker -l info
