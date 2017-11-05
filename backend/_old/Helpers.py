import os

from werkzeug.utils import secure_filename


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'csv']


def save_file(file, folder):
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        saved_filename = os.path.join(folder, filename)
        file.save(saved_filename)
        return saved_filename
    return False
