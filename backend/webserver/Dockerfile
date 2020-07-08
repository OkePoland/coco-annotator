FROM tantael/multi-annotator:python-env

WORKDIR /workspace/

# Install python package dependices
COPY ./backend/ /workspace/
COPY ./.git /workspace/.git
RUN python set_path.py

COPY ./backend/requirements.txt /workspace/

# Install python package dependices
RUN pip install -r requirements.txt

ENV FLASK_ENV=development
ENV DEBUG=true

EXPOSE 5000
CMD gunicorn -c webserver/gunicorn_config.py webserver:app --no-sendfile


