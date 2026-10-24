"use client";

import { FormEvent, useEffect, useState } from "react";

type SavedInbox = { handle: string; inboxKey: string };
type InboxMessage = { id: number; body: string; theme: string; createdAt: string };

const themes = [
  { id: "light", label: "prismatic", description: "a little light" },
  { id: "bloom", label: "midnight", description: "after dark" },
  { id: "paper", label: "paper", description: "soft & quiet" },
  { id: "sea", label: "blue hour", description: "still aching" },
];

function readSavedInbox() {
  try {
    const saved = window.localStorage.getItem("untold-inbox");
    return saved ? (JSON.parse(saved) as SavedInbox) : null;
  } catch { return null; }
}

export default function Home() {
  const [claimHandle, setClaimHandle] = useState("");
  const [claimState, setClaimState] = useState("");
  const [claimedInbox, setClaimedInbox] = useState<SavedInbox | null>(null);
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [theme, setTheme] = useState("light");
  const [sendState, setSendState] = useState("");
  const [inboxHandle, setInboxHandle] = useState("");
  const [inboxKey, setInboxKey] = useState("");
  const [inboxState, setInboxState] = useState("");
  const [received, setReceived] = useState<InboxMessage[] | null>(null);

  useEffect(() => {
    const saved = readSavedInbox();
    if (!saved) return;
    setClaimedInbox(saved);
    setInboxHandle(saved.handle);
    setInboxKey(saved.inboxKey);
  }, []);

  async function claimInbox(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setClaimState("claiming...");
    try {
      const response = await fetch("/api/handles", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ handle: claimHandle }) });
      const data = (await response.json()) as { handle?: string; inboxKey?: string; error?: string };
      if (!response.ok || !data.handle || !data.inboxKey) { setClaimState(data.error ?? "That handle could not be claimed."); return; }
      const inbox = { handle: data.handle, inboxKey: data.inboxKey };
      window.localStorage.setItem("untold-inbox", JSON.stringify(inbox));
      setClaimedInbox(inbox); setInboxHandle(inbox.handle); setInboxKey(inbox.inboxKey); setClaimHandle(""); setClaimState("");
    } catch { setClaimState("Connection problem. Please try again."); }
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSendState("placing your echo...");
    try {
      const response = await fetch("/api/messages", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ recipientHandle: recipient, message, theme }) });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) { setSendState(data.error ?? "This message could not be placed."); return; }
      setRecipient(""); setMessage(""); setTheme("light"); setSendState("It is held. They can open it with their private inbox key.");
    } catch { setSendState("Connection problem. Please try again."); }
  }

  async function openInbox(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setInboxState("opening..."); setReceived(null);
    try {
      const response = await fetch("/api/inbox", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ handle: inboxHandle, inboxKey }) });
      const data = (await response.json()) as { messages?: InboxMessage[]; error?: string };
      if (!response.ok || !data.messages) { setInboxState(data.error ?? "That inbox could not be opened."); return; }
      setReceived(data.messages);
      setInboxState(data.messages.length ? "" : "Nothing is here yet. Quiet can be a kind of answer, too.");
    } catch { setInboxState("Connection problem. Please try again."); }
  }

  return (
    <main>
      <div className="grain" aria-hidden="true" />
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Untold home">untold<span>.</span></a>
        <p className="header-note">no profiles · no replies · no trace back</p>
        <a className="nav-link" href="#inbox">open inbox ↘</a>
      </header>
      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">a quiet place for the almost-said</p>
          <h1>Let the words<br />find you, <em>not<br />your name.</em></h1>
          <p className="hero-intro">Claim a small private handle. Let people leave a message there. No profiles, no replies, no way to connect the two of you.</p>
          <div className="hero-actions"><a className="button button-light" href="#claim">claim a handle <span>↓</span></a><a className="quiet-link" href="#write">leave someone an echo <span>↘</span></a></div>
        </div>
        <figure className="hero-art"><img src="/assets/prismatic-dove.jpeg" alt="A dove in a prism of bright sky" /><figcaption>you can stay unknown</figcaption><div className="art-message"><p className="message-kicker">the only thing a sender needs</p><p>@your_handle</p></div></figure>
        <p className="scroll-cue">a name can be an address, not an identity <span>↓</span></p>
      </section>

      <section className="privacy-band" aria-labelledby="privacy-title">
        <p className="eyebrow">privacy, by design</p><h2 id="privacy-title">Your handle is an <em>address.</em><br />It is not a profile.</h2>
        <div className="privacy-points">
          <article><span>01</span><strong>no account trail</strong><p>We do not ask senders for a name, email, profile, or reply address.</p></article>
          <article><span>02</span><strong>private by default</strong><p>A handle alone cannot open messages. Your private inbox key does that.</p></article>
          <article><span>03</span><strong>no social graph</strong><p>There are no follows, searches for people, activity lists, or connected identities.</p></article>
        </div>
      </section>

      <section className="claim-section" id="claim">
        <div className="section-heading"><p className="eyebrow">step 01</p><h2>Claim a tiny<br /><em>corner of the sky.</em></h2><p>A handle is the only thing you share. Use something that does not reveal who you are.</p></div>
        <div className="claim-panel">
          {claimedInbox ? <div className="key-reveal"><p className="eyebrow">your address is held</p><p className="handle-display">@{claimedInbox.handle}</p><div className="key-box"><span>private inbox key</span><code>{claimedInbox.inboxKey}</code></div><p className="key-note">This key stays only on this device. Save it somewhere safe: it is the only way to open this inbox on another device.</p><a className="quiet-link dark-link" href="#inbox">open my inbox <span>↘</span></a></div> :
          <form onSubmit={claimInbox}><label htmlFor="claim-handle">choose a private handle</label><div className="handle-input"><span>@</span><input id="claim-handle" value={claimHandle} onChange={(event) => setClaimHandle(event.target.value)} placeholder="moon_after_rain" minLength={3} maxLength={24} autoCapitalize="none" autoComplete="off" required /></div><p className="field-note">3–24 lowercase letters, numbers, or underscores. No real name needed.</p><button className="button button-dark" type="submit">claim this handle <span>↗</span></button><p className="form-state" role="status">{claimState}</p></form>}
        </div>
      </section>

      <section className="write-section" id="write">
        <div className="write-art" aria-hidden="true" />
        <div className="write-copy"><p className="eyebrow">step 02</p><h2>Leave what you<br /><em>couldn't say.</em></h2><p>They receive a message. You leave no name, no return path, and no trace of a connection.</p></div>
        <form className="message-form" onSubmit={sendMessage}>
          <label htmlFor="recipient">their handle</label><div className="handle-input light-input"><span>@</span><input id="recipient" value={recipient} onChange={(event) => setRecipient(event.target.value)} placeholder="the_handle_they_shared" minLength={3} maxLength={24} autoCapitalize="none" autoComplete="off" required /></div>
          <label htmlFor="message">your unsent message <small>{message.length} / 420</small></label><textarea id="message" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="i still think about the way..." maxLength={420} required />
          <fieldset><legend>give it a little weather</legend><div className="theme-grid">{themes.map((item) => <label className={"theme-choice " + (theme === item.id ? "selected" : "")} key={item.id}><input type="radio" name="theme" value={item.id} checked={theme === item.id} onChange={() => setTheme(item.id)} /><span className={"theme-dot " + item.id} /><strong>{item.label}</strong><i>{item.description}</i></label>)}</div></fieldset>
          <button className="button button-light" type="submit">leave this here <span>↗</span></button><p className="form-state light-state" role="status">{sendState}</p>
        </form>
      </section>

      <section className="inbox-section" id="inbox">
        <div className="inbox-copy"><p className="eyebrow">step 03</p><h2>Open what<br />found <em>you.</em></h2><p>Your handle finds the door. Your private inbox key turns it.</p></div>
        <div className="inbox-panel">
          <form onSubmit={openInbox}><label htmlFor="inbox-handle">your handle</label><div className="handle-input"><span>@</span><input id="inbox-handle" value={inboxHandle} onChange={(event) => setInboxHandle(event.target.value)} placeholder="your_handle" minLength={3} maxLength={24} autoCapitalize="none" autoComplete="off" required /></div><label htmlFor="inbox-key">private inbox key</label><input className="key-input" id="inbox-key" value={inboxKey} onChange={(event) => setInboxKey(event.target.value)} placeholder="your saved key" autoComplete="off" required /><button className="button button-dark" type="submit">open my inbox <span>↗</span></button></form>
          <p className="form-state" role="status">{inboxState}</p>
          {received && received.length > 0 && <div className="received-list" aria-live="polite"><p className="eyebrow">{received.length} {received.length === 1 ? "echo" : "echoes"} received</p>{received.map((item) => <article className={"received-message theme-" + item.theme} key={item.id}><span className="message-kicker">left for you · {new Date(item.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span><p>{item.body}</p><span className="card-star">✦</span></article>)}</div>}
        </div>
      </section>

      <section className="closing"><p className="eyebrow">quietly, on purpose</p><h2>Some words only<br />need a place to <em>land.</em></h2><a className="button button-light" href="#write">leave an echo <span>↗</span></a></section>
      <footer><a className="wordmark" href="#top">untold<span>.</span></a><p>for the feelings that outlived their moment</p><a href="#claim">claim a handle ↑</a></footer>
    </main>
  );
}
