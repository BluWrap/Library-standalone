import { useState } from 'react';
import { BookOpen, Search, ExternalLink, Sparkles } from 'lucide-react';

type Book = {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  number_of_pages_median?: number;
  cover_i?: number;
};

export default function App() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<Book | null>(null);
  const [summary, setSummary] = useState('');
  const [teaching, setTeaching] = useState('');

  async function searchBooks(event: React.FormEvent) {
    event.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setSelected(null);
    try {
      const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20`);
      if (!response.ok) throw new Error('Book search is temporarily unavailable.');
      const data = await response.json();
      setBooks((data.docs ?? []) as Book[]);
      if (!data.docs?.length) setError('No matching books found. Try another title or author.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not search right now.');
    } finally {
      setLoading(false);
    }
  }

  return <main className="shell">
    <header className="top">
      <div className="brand"><span className="logo"><BookOpen size={24}/></span><div><h1>Library</h1><p>Your NILAM reading companion</p></div></div>
      <span className="pill">Standalone starter</span>
    </header>
    <section className="hero">
      <span className="eyebrow"><Sparkles size={14}/> READ · DISCOVER · RECORD</span>
      <h2>Find your next<br/><em>great read.</em></h2>
      <p>Search the Open Library catalogue, then prepare your own Summary and Teaching notes.</p>
      <form onSubmit={searchBooks} className="search">
        <Search size={19}/>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by book title or author…" aria-label="Search books"/>
        <button disabled={loading}>{loading ? 'Searching…' : 'Search'}</button>
      </form>
    </section>
    {error && <p className="message">{error}</p>}
    {selected && <section className="editor">
      <div className="editor-head"><div><span className="eyebrow">READING RECORD</span><h3>{selected.title}</h3><p>{selected.author_name?.join(', ') || 'Author not listed'} · {selected.first_publish_year || 'Year unknown'} · {selected.number_of_pages_median || 'Pages unknown'} pages</p></div><button className="secondary" onClick={() => setSelected(null)}>Close</button></div>
      <label>Summary<textarea value={summary} onChange={e => setSummary(e.target.value)} placeholder="Write a summary based on the book you read…"/></label>
      <label>Teaching<textarea value={teaching} onChange={e => setTeaching(e.target.value)} placeholder="What lesson did you learn from the book?"/></label>
      <button onClick={() => navigator.clipboard?.writeText(`Title: ${selected.title}\nAuthor: ${selected.author_name?.join(', ') || 'Unknown'}\nYear: ${selected.first_publish_year || 'Unknown'}\nPages: ${selected.number_of_pages_median || 'Unknown'}\nSummary: ${summary}\nTeaching: ${teaching}`)}>Copy NILAM record</button>
      <p className="hint">Notes are kept in this page only for now. Cloud saving and AI generation are not connected yet.</p>
    </section>}
    <section className="results">
      <div className="section-head"><h3>{books.length ? 'Search results' : 'Ready when you are'}</h3><span>{books.length ? `${books.length} books` : 'Open Library catalogue'}</span></div>
      {books.length ? <div className="grid">{books.map(book => <button className="book" key={book.key} onClick={() => {setSelected(book);setSummary('');setTeaching('');}}>
        <span className="book-icon"><BookOpen size={23}/></span><strong>{book.title}</strong><span>{book.author_name?.[0] || 'Author unknown'}</span><small>{book.first_publish_year || 'Year unknown'}{book.number_of_pages_median ? ` · ${book.number_of_pages_median} pages` : ''}</small><span className="open-label">Prepare record <ExternalLink size={13}/></span>
      </button>)}</div> : <div className="empty"><BookOpen size={34}/><p>Search for a title, author, or topic to explore books.</p></div>}
    </section>
    <footer>Independent starter project · Catalogue data from Open Library</footer>
  </main>;
}
