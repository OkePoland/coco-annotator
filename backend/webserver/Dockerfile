FROM tantael/tensorrt-opencv4:cuda-10-2
#FROM scratch

WORKDIR /workspace/

# Install python package dependices
COPY ./backend/ /workspace/
COPY ./.git /workspace/.git
ENV PATH /workspace/:$PATH
ENV PYTHONPATH=$PYTHONPATH:/workspace
RUN python3 set_path.py

COPY ./backend/requirements.txt /workspace/
# Install python package dependices
RUN apt-get -y install python3-pip
RUN python3 -m pip install --upgrade pip
RUN python3 -m pip install -r requirements.txt pycocotools
RUN apt-get -y install python3-setuptools
RUN git clone --single-branch --depth 1 https://github.com/SAlberte/Mask_RCNN.git /tmp/maskrcnn &&     cd /tmp/maskrcnn &&  python3 setup.py install
RUN git clone --single --depth 1 https://github.com/SAlberte/dextr-keras.git /tmp/dextr &&     cd /tmp/dextr && python3 setup.py install
#RUN apt-get -y install gunicorn3
RUN python3 -m pip install gunicorn[eventlet]==19.9.0
RUN apt-get -o Dpkg::Options::="--force-confmiss" install --reinstall netbase
#RUN python3 -m install gunicorn
ENV FLASK_ENV=production
ENV DEBUG=false
ENV FLASK_DEBUG=1
#ENV FLASK_DEBUG=1

EXPOSE 5000
CMD pwd && python3 -m gunicorn.app.wsgiapp -c webserver/gunicorn_config.py webserver:app --no-sendfile --timeout 180
#CMD tail -f /dev/null
