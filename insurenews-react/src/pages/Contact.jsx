import { useState } from 'react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !message) {
      setStatus('Please fill in all required fields.');
      return;
    }

    const mailtoSubject = encodeURIComponent(subject || `Contact from ${name}`);
    const mailtoBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );

    window.location.href = `mailto:prasad.kulal@example.com?subject=${mailtoSubject}&body=${mailtoBody}`;
    setStatus('Opening your email client...');
  };

  return (
    <>
      <div className="container">
        <div className="page-header">
          <div className="eyebrow">Get in touch</div>
          <h1>Contact</h1>
          <p className="page-header-desc">
            Have a question, suggestion, or want to discuss insurance analysis?
            Reach out directly.
          </p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="contact-name">Name *</label>
            <input
              id="contact-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="contact-email">Email *</label>
            <input
              id="contact-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="contact-subject">Subject</label>
            <input
              id="contact-subject"
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="contact-message">Message *</label>
            <textarea
              id="contact-message"
              value={message}
              onChange={e => setMessage(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Send Message
          </button>
          {status && <div className="form-status">{status}</div>}
        </form>

        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <div style={{ height: '1px', background: 'var(--border)', marginBottom: '2rem' }} />
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Or connect with me directly
          </p>
          <a
            href="https://www.linkedin.com/in/prasadkulal/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            Connect on LinkedIn
          </a>
        </div>
      </div>
    </>
  );
}
