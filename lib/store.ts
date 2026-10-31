import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { randomBytes, randomUUID } from "node:crypto";

export type Letter = {
  id: string;
  sender_name: string;
  sender_email: string;
  recipient_name: string;
  recipient_email: string;
  body: string;
  route_id: string;
  reverse: boolean;
  sent_at: string;
  arrives_at: string;
  sender_token: string;
  recipient_token: string;
  arrival_notified_at: string | null;
  opened_at: string | null;
  reply_to: string | null;
};

export type NewLetter = Omit<
  Letter,
  "id" | "sender_token" | "recipient_token" | "arrival_notified_at" | "opened_at"
>;

export type Viewer = "sender" | "recipient";

interface Store {
  insert(letter: NewLetter): Promise<Letter>;
  byToken(token: string): Promise<{ letter: Letter; viewer: Viewer } | null>;
  replyOf(id: string): Promise<Letter | null>;
  markOpened(id: string): Promise<void>;
  dueForNotice(now: Date): Promise<Letter[]>;
  markNotified(id: string): Promise<void>;
}

const token = () => randomBytes(24).toString("base64url");

function withIds(letter: NewLetter): Letter {
  return {
    ...letter,
    id: randomUUID(),
    sender_token: token(),
    recipient_token: token(),
    arrival_notified_at: null,
    opened_at: null,
  };
}

class SupabaseStore implements Store {
  constructor(private db: SupabaseClient) {}

  async insert(letter: NewLetter) {
    const { data, error } = await this.db.from("letters").insert(withIds(letter)).select().single();
    if (error) throw error;
    return data as Letter;
  }

  async byToken(t: string) {
    const { data, error } = await this.db
      .from("letters")
      .select()
      .or(`sender_token.eq.${t},recipient_token.eq.${t}`)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    const letter = data as Letter;
    return { letter, viewer: (letter.sender_token === t ? "sender" : "recipient") as Viewer };
  }

  async replyOf(id: string) {
    const { data, error } = await this.db.from("letters").select().eq("reply_to", id).maybeSingle();
    if (error) throw error;
    return (data as Letter) ?? null;
  }

  async markOpened(id: string) {
    const { error } = await this.db
      .from("letters")
      .update({ opened_at: new Date().toISOString() })
      .eq("id", id)
      .is("opened_at", null);
    if (error) throw error;
  }

  async dueForNotice(now: Date) {
    const { data, error } = await this.db
      .from("letters")
      .select()
      .is("arrival_notified_at", null)
      .lte("arrives_at", now.toISOString())
      .limit(100);
    if (error) throw error;
    return data as Letter[];
  }

  async markNotified(id: string) {
    const { error } = await this.db
      .from("letters")
      .update({ arrival_notified_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
  }
}

/** Keeps letters in process memory; only for trying the app locally without Supabase. */
class MemoryStore implements Store {
  private letters: Letter[] = [];

  async insert(letter: NewLetter) {
    const row = withIds(letter);
    this.letters.push(row);
    return row;
  }

  async byToken(t: string) {
    const letter = this.letters.find((l) => l.sender_token === t || l.recipient_token === t);
    if (!letter) return null;
    return { letter, viewer: (letter.sender_token === t ? "sender" : "recipient") as Viewer };
  }

  async replyOf(id: string) {
    return this.letters.find((l) => l.reply_to === id) ?? null;
  }

  async markOpened(id: string) {
    const l = this.letters.find((x) => x.id === id);
    if (l && !l.opened_at) l.opened_at = new Date().toISOString();
  }

  async dueForNotice(now: Date) {
    return this.letters.filter((l) => !l.arrival_notified_at && new Date(l.arrives_at) <= now);
  }

  async markNotified(id: string) {
    const l = this.letters.find((x) => x.id === id);
    if (l) l.arrival_notified_at = new Date().toISOString();
  }
}

const globalStore = globalThis as unknown as { __store?: Store };

export function store(): Store {
  if (!globalStore.__store) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    globalStore.__store =
      url && key
        ? new SupabaseStore(createClient(url, key, { auth: { persistSession: false } }))
        : new MemoryStore();
  }
  return globalStore.__store;
}
