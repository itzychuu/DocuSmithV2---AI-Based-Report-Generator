import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import './Features.css';
import { generateReportAPI, exportFile, saveProject } from '../../services/api';

const ReportGenerator = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [headings, setHeadings] = useState([{ id: 1, title: '', wordCount: '', subheadings: [] }]);
  const [analyzed, setAnalyzed] = useState(false);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const addHeading = () => {
    setHeadings([...headings, { id: Date.now(), title: '', wordCount: '', subheadings: [] }]);
  };

  const addSubheading = (id) => {
    setHeadings(headings.map(h =>
      h.id === id ? { ...h, subheadings: [...h.subheadings, { id: Date.now(), title: '', wordCount: '' }] } : h
    ));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      document.getElementById('referenceName').value = file.name;
    }
  };

  const buildStructure = () => {
    return headings
      .map(h => {
        let str = h.title ? (h.wordCount ? `${h.title} [${h.wordCount} words]` : h.title) : '';
        if (h.subheadings.length > 0) {
          str += '\n' + h.subheadings
            .map(s => s.title ? (s.wordCount ? `  - ${s.title} [${s.wordCount} words]` : `  - ${s.title}`) : '')
            .filter(Boolean)
            .join('\n');
        }
        return str;
      })
      .filter(Boolean)
      .join('\n');
  };

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const structure = buildStructure();
      const data = await generateReportAPI(uploadedFile, structure);
      setOutput(data.output || 'Error generating content. Please try again.');
      setAnalyzed(true);
    } catch (err) {
      setOutput('Error generating content. Please try again.');
      setAnalyzed(true);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type) => {
    if (!output) return;

    try {
      const blob = await exportFile(output, type);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report.${type}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error generating content');
    }
  };

  const handleSave = () => {
    if (!output) return;
    const title = headings[0]?.title || 'Generated Report';
    saveProject(title, output);
    alert('Project saved!');
  };

  return (
    <div className="feature-page-container">
      <div className="feature-left green-bg">
        <div className="feature-header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={40} />
          </button>
          <h1>Generate Content</h1>
        </div>

        <div className="generator-controls">
          <div className="structure-builder">
            {headings.map((heading) => (
              <div key={heading.id} className="heading-item">
                <div style={{display: 'flex', gap: '10px', alignItems: 'flex-start'}}>
                  <input 
                    type="text" 
                    placeholder="Enter Heading" 
                    className="heading-input"
                    style={{flex: 1}}
                    value={heading.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      setHeadings(headings.map(h => h.id === heading.id ? { ...h, title: newTitle } : h));
                    }}
                  />
                  <input 
                    type="number" 
                    placeholder="No. of words" 
                    className="word-count-input"
                    value={heading.wordCount}
                    onChange={(e) => {
                      const wc = e.target.value;
                      setHeadings(headings.map(h => h.id === heading.id ? { ...h, wordCount: wc } : h));
                    }}
                  />
                </div>
                <div className="subheadings-list">
                  {heading.subheadings.map(sub => (
                    <div key={sub.id} style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                      <input 
                        type="text" 
                        placeholder="Enter Sub-Heading" 
                        className="subheading-input"
                        style={{flex: 1}}
                        value={sub.title}
                        onChange={(e) => {
                          const newTitle = e.target.value;
                          setHeadings(headings.map(h =>
                            h.id === heading.id
                              ? { ...h, subheadings: h.subheadings.map(s => s.id === sub.id ? { ...s, title: newTitle } : s) }
                              : h
                          ));
                        }}
                      />
                      <input 
                        type="number" 
                        placeholder="Words" 
                        className="word-count-input small-word"
                        value={sub.wordCount}
                        onChange={(e) => {
                          const wc = e.target.value;
                          setHeadings(headings.map(h =>
                            h.id === heading.id
                              ? { ...h, subheadings: h.subheadings.map(s => s.id === sub.id ? { ...s, wordCount: wc } : s) }
                              : h
                          ));
                        }}
                      />
                    </div>
                  ))}
                  <button className="add-sub-btn" onClick={() => addSubheading(heading.id)}>
                    <PlusCircle size={20} /> Add Sub Heading
                  </button>
                </div>
              </div>
            ))}
            <button className="add-head-btn" onClick={addHeading}>
              <PlusCircle size={24} /> Add Heading
            </button>
          </div>

          <div className="input-box small" style={{marginTop: '20px'}}>
            <input type="text" placeholder="Upload Reference (Abstract/Code)" id="referenceName" />
            <input type="file" ref={fileInputRef} style={{display: 'none'}} onChange={handleFileChange} />
            <button className="add-file-btn" onClick={() => fileInputRef.current.click()}><PlusCircle /></button>
          </div>

          <button className="btn-primary submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Generating...' : 'Submit'}
          </button>
        </div>
      </div>

      <div className={`feature-right dark-bg`}>
        <div className="preview-header">
          <h2>Preview</h2>
        </div>
        <div className="preview-box">
          {analyzed ? (
            <div className="generated-report">
              <h3>Table of Contents</h3>
              {headings.map(h => (
                <div key={h.id}>
                  <p>{h.title}</p>
                  {h.subheadings.map(s => <p style={{marginLeft: '20px'}}>- {s.title}</p>)}
                </div>
              ))}
              <hr />
              <p style={{whiteSpace: 'pre-wrap'}}>{output}</p>
              <p style={{fontSize: '0.75em', opacity: 0.5, marginTop: '12px'}}>Note: The generated content may not be fully accurate. Please review and verify before use.</p>
            </div>
          ) : (
            <p className="placeholder-text">Your structure will appear here...</p>
          )}
        </div>
        <div className="preview-actions">
          <button className="btn-outline" onClick={handleSubmit}>Generate Again</button>
          <button className="btn-outline" onClick={handleSave}>Save</button>
          <button className="btn-outline" onClick={() => handleExport('docx')}>Export DOCX</button>
          <button className="btn-outline" onClick={() => handleExport('pdf')}>Export PDF</button>
          <button className="btn-outline" onClick={() => handleExport('txt')}>Export TXT</button>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;
