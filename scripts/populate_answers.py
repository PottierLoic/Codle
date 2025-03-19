import json
import supabase
import datetime
import random

with open("supabaseConfig.json", "r") as file:
  config = json.load(file)

supabase_client = supabase.create_client(config["SUPABASE_URL"], config["SERVICE_ROLE_KEY"])

def fetch_language_ids():
  """Fetch all language IDs from Supabase."""
  response = supabase_client.table("language").select("id, name").execute()
  if hasattr(response, "error") and response.error is not None:
    print(f"❌ Failed to fetch languages: {response.error}")
    return []
  return response.data

def fetch_snippet_ids():
  """Fetch all snippet IDs from Supabase."""
  response = supabase_client.table("snippet").select("id, code").execute()
  if hasattr(response, "error") and response.error is not None:
    print(f"❌ Failed to fetch snippets: {response.error}")
    return []
  return response.data

def delete_future_entries():
  """Deletes all future entries from `answer` table, keeping past data untouched."""
  today = datetime.date.today().strftime("%Y-%m-%d")
  response, error = supabase_client.table("answer").delete().gt("date", today).execute()
  if error:
    print(f"❌ Failed to delete future entries: {error}")
  else:
    print(f"🗑️ Deleted all future entries from {today} onwards.")

def populate_future_answers():
  """Populates `answer` table with random languages and snippets for the next 30 days."""
  languages = fetch_language_ids()
  snippets = fetch_snippet_ids()

  if not languages or not snippets:
    print("❌ Cannot populate. No languages or snippets found in Supabase.")
    return

  today = datetime.date.today()
  new_entries = []

  N_DAYS = 30
  for i in range(1, N_DAYS + 1):
    date_obj = today + datetime.timedelta(days=i)
    date_str = date_obj.strftime("%Y-%m-%d")
    chosen_lang = random.choice(languages)
    chosen_snippet = random.choice(snippets)
    print(f"📅 Assigning {date_str} => Language: {chosen_lang['name']} | Snippet ID: {chosen_snippet['id']}")
    new_entries.append({
      "date": date_str,
      "language_id": chosen_lang["id"],
      "snippet_id": chosen_snippet["id"]
    })
  response, error = supabase_client.table("answer").upsert(new_entries, on_conflict=["date"]).execute()
  if error:
    print(f"❌ Failed to insert new entries: {error}")
  else:
    print(f"✅ Successfully populated future {N_DAYS} days!")

if __name__ == "__main__":
  delete_future_entries()
  populate_future_answers()
