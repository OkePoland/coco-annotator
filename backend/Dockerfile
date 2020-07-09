# Backend environment docker image
FROM tantael/multi-annotator:python-env

WORKDIR /workspace/

# Copy backend
COPY ./backend/requirements.txt /workspace/

# Install python package dependices
RUN pip3 install -r requirements.txt && \
    pip3 install gunicorn[eventlet]==19.9.0 && \
    pip3 install pycocotools

# Install maskrcnn
RUN rm -r /tmp/maskrcnn
RUN git clone --single-branch --depth 1 https://github.com/matterport/Mask_RCNN.git /tmp/maskrcnn && \
    cd /tmp/maskrcnn && \
    pip3 install -r requirements.txt && \
    python3 setup.py install

# Install DEXTR
RUN rm -r /tmp/dextr

RUN git clone --single --depth 1 https://github.com/jsbroks/dextr-keras.git /tmp/dextr && \
    cd /tmp/dextr && \
    pip3 install -r requirements.txt && \
    python3 setup.py install

EXPOSE 5555
CMD celery -A workers worker -l info

