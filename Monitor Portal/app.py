from flask import Flask, render_template

app = Flask(__name__)

# Dummy data for flagged posts
posts = [
    {"id": 1, "platform": "Facebook", "post_id": 7283929, "keywords": "hate speech", "flags": 5, "url": "https://www.facebook.com/share/p/Wdesbu7UGSRugRin/"},
    {"id": 2, "platform": "Instagram", "post_id": 1637369, "keywords": "scam", "flags": 15, "url": "https://www.instagram.com/p/CzUVDpwSnsd/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="},
    {"id": 3, "platform": "YouTube", "post_id": 3984929, "keywords": "fake news", "flags": 8, "url": "https://www.youtube.com/watch?v=3984929"},
    {"id": 4, "platform": "X", "post_id": 6341548, "keywords": "racist", "flags": 20, "url": "https://twitter.com/anyuser/status/6341548"},
    {"id": 5, "platform": "HardwareZone", "post_id": 1429313, "keywords": "fraud", "flags": 2, "url": "https://www.hardwarezone.com.sg/post/1429313"},
]


# Threshold for "Required Attention"
threshold = 10


@app.route('/')
def index():
    return render_template('index.html', posts=posts, threshold=threshold)


if __name__ == '__main__':
    app.run(debug=True)
