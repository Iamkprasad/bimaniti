import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { PageHeader } from '../components/PageHeader';
import './Contact.css';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error: supabaseError } = await supabase
          .from('contacts')
          .insert([{
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            created_at: new Date().toISOString(),
          }]);

        if (supabaseError) throw supabaseError;

        setSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to submit message');
      } finally {
        setLoading(false);
      }
    } else {
      // Fallback: open mailto
      const subject = encodeURIComponent(formData.subject || `Contact from ${formData.name}`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
      );
      window.open(`mailto:prasad.kulal@example.com?subject=${subject}&body=${body}`, '_blank');
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Get in touch"
        title="Contact"
        description="Get in touch with BimaNiti for inquiries, feedback, or collaboration opportunities."
      />
      <div className="max-w-2xl mx-auto py-12 px-4">
        {success && (
          <div role="alert" className="contact-alert contact-alert-success">
            {isSupabaseConfigured
              ? "Thank you for your message! I'll get back to you soon."
              : "Opening your email client... If it didn't open, send an email to prasad.kulal@example.com"}
          </div>
        )}
        {error && (
          <div role="alert" className="contact-alert contact-alert-error">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="contact-field">
            <label htmlFor="name" className="contact-label">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="contact-input"
              disabled={loading}
            />
          </div>

          <div className="contact-field">
            <label htmlFor="email" className="contact-label">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="contact-input"
              disabled={loading}
            />
          </div>

          <div className="contact-field">
            <label htmlFor="subject" className="contact-label">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="contact-input"
              disabled={loading}
            />
          </div>

          <div className="contact-field">
            <label htmlFor="message" className="contact-label">Message *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className="contact-input"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', marginTop: '0.5rem' }}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>

        {!isSupabaseConfigured && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '1.5rem' }}>
            Contact form uses mailto fallback. Configure Supabase for direct form submission.
          </p>
        )}

        
      </div>
    </>
  );
};
