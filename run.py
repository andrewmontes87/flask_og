from flask import Flask, send_from_directory, url_for
app = Flask(__name__)


@app.route("/")
def index():
    url_for('static', filename='css/app.css')
    url_for('static', filename='js/app.min.js')
    url_for('static', filename='img/**/*.jpg')
    return send_from_directory('static/templates', 'index.html')

if __name__ == "__main__":
    app.run(port=8000,debug=True)
