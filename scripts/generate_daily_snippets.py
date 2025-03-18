import firebase_admin
from firebase_admin import credentials, firestore
import json
import random
import datetime

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

with open("data/snippets.json", "r", encoding="utf-8") as f:
  snippets = json.load(f)

today = datetime.date.today()
daily_snippet_ref = db.collection("dailySnippet")
docs = daily_snippet_ref.stream()
for doc in docs:
  doc_id = doc.id
  try:
    doc_date = datetime.datetime.strptime(doc_id, "%Y-%m-%d").date()
  except ValueError:
    continue

  if doc_date > today:
    print(f"Deleting future doc: {doc_id}")
    doc.reference.delete()

N_DAYS = 30
for i in range(1, N_DAYS + 1):
  date_obj = today + datetime.timedelta(days=i)
  doc_id = date_obj.strftime("%Y-%m-%d")
  choose_snippet = random.choice(snippets)
  print(f"Creating doc {doc_id}")
  daily_snippet_ref.document(doc_id).set(choose_snippet)

print("Documents updated with snippet data.")
