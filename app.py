from flask import Flask, jsonify, request
import requests

app = Flask(__name__)

@app.route('/fetch_feed')
def fetch_feed():
    url = request.args.get('url')
    
    try:
        # Fetch the RSS feed from the external site
        response = requests.get(url)
        response.raise_for_status()  # Check for HTTP errors
        
        # Return the raw XML content as plain text
        return response.content, 200, {'Content-Type': 'application/xml'}
    
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
