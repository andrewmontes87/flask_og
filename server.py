from flask import Flask, send_from_directory, url_for
app = Flask(__name__)


@app.route("/")
def index():
    url_for('static', filename='css/style.css')
    url_for('static', filename='js/script.js')
    url_for('static', filename='img/**/*.jpg')
    return send_from_directory('./templates', 'index.html')

if __name__ == "__main__":
    app.run(port=8000,debug=True)
