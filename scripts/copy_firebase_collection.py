import firebase_admin
from firebase_admin import credentials, firestore
import sys

def copy_firestore_collection(source_collection: str, destination_collection: str):
  cred = credentials.Certificate("serviceAccountKey.json")
  firebase_admin.initialize_app(cred)
  db = firestore.client()
  source_ref = db.collection(source_collection)
  destination_ref = db.collection(destination_collection)
  docs = source_ref.stream()
  copied_count = 0
  for doc in docs:
    doc_id = doc.id
    doc_data = doc.to_dict()
    destination_ref.document(doc_id).set(doc_data)
    copied_count += 1
    print(f"Copied: {doc_id}")
  print(f"\nSuccessfully copied {copied_count} documents from '{source_collection}' to '{destination_collection}'.")

if __name__ == "__main__":
  if len(sys.argv) != 3:
    print("Usage: python copy_firestore_collection.py <source_collection> <destination_collection>")
    sys.exit(1)
  source_collection = sys.argv[1]
  destination_collection = sys.argv[2]
  copy_firestore_collection(source_collection, destination_collection)
