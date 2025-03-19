import json
import supabase

with open("supabaseConfig.json", "r") as file:
  config = json.load(file)

supabase_client = supabase.create_client(config["SUPABASE_URL"], config["SERVICE_ROLE_KEY"])

with open("data/snippets.json", "r", encoding="utf-8") as file:
  snippets = json.load(file)

def upload_snippets():
  try:
    response, error = supabase_client.table("snippet").upsert(snippets, on_conflict=["id"]).execute()
    print("✅ All snippets uploaded or updated successfully!")
  except Exception as e:
    print(f"❌ Exception occurred: {e}")

if __name__ == "__main__":
  upload_snippets()
