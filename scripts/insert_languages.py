import json
import supabase

with open("supabaseConfig.json", "r") as file:
  config = json.load(file)

supabase_client = supabase.create_client(config["SUPABASE_URL"], config["SERVICE_ROLE_KEY"])

with open("data/languages.json", "r", encoding="utf-8") as file:
  languages = json.load(file)

def upload_languages():
  try:
    response, error = supabase_client.table("language").upsert(languages, on_conflict=["name"]).execute()
    print("✅ All languages uploaded or updated successfully!")
  except Exception as e:
    print(f"❌ Exception occurred: {e}")

if __name__ == "__main__":
  upload_languages()
