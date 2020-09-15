FROM tantael/multi-annotator:python-env

WORKDIR /workspace/

# Install python package dependices
COPY ./backend/ /workspace/
COPY ./models/ /workspace/
RUN python set_path.py

COPY ./backend/requirements.txt /workspace/
RUN pip install -r requirements.txt

ENV FLASK_ENV=Development
ENV DEBUG=True
EXPOSE 5555
CMD celery -A workers worker -l info

