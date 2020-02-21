class Messenger:
    current_task = None

    def connect_task(self, task):
        self.current_task = task

    def message(self, msg):
        self.current_task.info(msg)


messenger = Messenger()
message = messenger.message
