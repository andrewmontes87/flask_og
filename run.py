from flask import Flask, send_from_directory, url_for,render_template
import os
app = Flask(__name__)

app.config['API_URL'] = os.environ.get('API_URL', 'http://localhost:5000/api/')


@app.route("/")
def index(API_URL='http://localhost:5000/api/'):
    url_for('static', filename='css/app.css')
    url_for('static', filename='js/app.min.js')
    url_for('static', filename='img/**/*.jpg')
    return render_template('index.html', API_URL=API_URL)

if __name__ == "__main__":
    app.run(port=8000,debug=True)
