from flask import Flask, request, jsonify, render_template
from datetime import datetime

app = Flask(__name__)

# A simple dictionary to simulate AI suggestions based on keywords
suggestion_map = {
    "spam": ["unwanted", "repetitive", "spam"],
    "nudity": ["nude", "sexual", "explicit", "naked", "exposing"],
    "hate": ["hate", "vilify", "incite", "discrimination", "loser", "go die", "unwanted"],
    "violence": ["violence", "dangerous", "attack", "punch", "fight"],
    "illegal": ["illegal", "regulated", "drugs", "offence", "sale"],
    "bullying": ["bully", "harass", "threat", "loser"],
    "ip-violation": ["copyright", "trademark", "intellectual"],
    "suicide": ["suicide", "self-harm", "injury", "kill yourself"],
    "eating-disorders": ["anorexia", "bulimia", "eating"],
    "deepfakes": ["manipulated", "celebrity"]
}


def find_genre_from_text(text):
    text = text.lower()
    for genre, keywords in suggestion_map.items():
        if any(keyword in text for keyword in keywords):
            return genre
    return None


reports = [
    {
        "id": "1",
        "date": "2024-08-08",
        "genres": ["spam", "nudity"],
        "post_owner": "User123",
        "status": "Complete"
    },
    {
        "id": "2",
        "date": "2024-08-09",
        "genres": ["hate"],
        "post_owner": "User456",
        "status": "Reviewing"
    }
]


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/profile')
def profile():
    return render_template('profile.html', reports=reports)


# @app.route('/submit_report', methods=['POST'])
# def submit_report():
#     data = request.get_json()
#     print("Data received:", data)  # Print the received data for debugging
#     return jsonify({"message": "Report submitted successfully"})


@app.route('/submit_report', methods=['POST'])
def submit_report():
    data = request.get_json()
    # Simulate adding a new report to the list
    new_report = {
        "id": str(len(reports) + 1),
        "date": datetime.now().strftime("%Y-%m-%d"),
        "genres": data["genres"],
        "post_owner": "UserXYZ",  # Example post owner
        "status": "Submitted"
    }
    reports.append(new_report)
    return jsonify({"message": "Report submitted successfully"})


@app.route('/ai_suggestion', methods=['POST'])
def ai_suggestion():
    data = request.get_json()
    text = data.get("text", "")
    suggested_genre = find_genre_from_text(text)
    return jsonify({"suggested_genre": suggested_genre})


@app.route('/check_report/<report_id>')
def check_report(report_id):
    report = next((r for r in reports if r["id"] == report_id), None)
    if report and report["status"] == "Complete":
        return jsonify({"success": True, "message": "The post has been taken down."})
    return jsonify({"success": False, "message": "The report is not complete or not found."})


if __name__ == '__main__':
    app.run(debug=True)
