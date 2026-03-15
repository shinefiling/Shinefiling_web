import React, { useState, useEffect } from 'react';
import {
    Mail, Search, Plus, Trash2, Edit2, Save, X, Clock, FileText, ChevronDown, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    getTemplates, createTemplate, updateTemplate, deleteTemplate
} from '../../../../api';

const EmailTemplates = () => {
    const [templates, setTemplates] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [templateForm, setTemplateForm] = useState({ name: '', type: 'EMAIL', subject: '', body: '', variables: '', active: true });
    const [isSaving, setIsSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const data = await getTemplates();
            setTemplates(data || []);
        } catch (e) {
            console.error("Failed to fetch templates", e);
        }
    };

    const handleSaveTemplate = async () => {
        setIsSaving(true);
        try {
            if (editingTemplate) {
                await updateTemplate(editingTemplate.id, templateForm);
            } else {
                await createTemplate(templateForm);
            }
            setEditingTemplate(null);
            setTemplateForm({ name: '', type: 'EMAIL', subject: '', body: '', variables: '', active: true });
            fetchTemplates();
        } catch (e) {
            alert(e.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteTemplate = async (id) => {
        if (window.confirm("Are you sure you want to delete this template?")) {
            try {
                await deleteTemplate(id);
                fetchTemplates();
            } catch (e) {
                alert(e.message);
            }
        }
    };

    const openTemplateEditor = (tpl = null) => {
        if (tpl) {
            setEditingTemplate(tpl);
            setTemplateForm({ ...tpl });
        } else {
            setEditingTemplate(null);
            setTemplateForm({ name: '', type: 'EMAIL', subject: '', body: '', variables: '', active: true });
        }
    };

    const getFilteredTemplates = () => {
        if (!searchQuery) return templates;
        return templates.filter(t => 
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            t.subject?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const EmailPreview = ({ title, body }) => {
        const htmlBody = body.replace(/\n/g, "<br>");
        const previewHtml = `
            <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; margin: 0; padding: 40px 20px; background-color: #f8fafc; color: #1e293b; height: 100%;">
                <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                    <div style="padding: 40px 20px; text-align: center; border-bottom: 1px solid #f1f5f9;">
                        <img src="https://shinefiling.com/logo.png" alt="ShineFiling" style="height: 60px;">
                    </div>
                    <div style="padding: 40px; line-height: 1.8; font-size: 16px;">
                        <h1 style="font-size: 20px; font-weight: 700; margin-bottom: 24px; color: #0f172a; border-bottom: 2px solid #f1f5f9; padding-bottom: 16px;">${title || 'Notification Title'}</h1>
                        <div style="color: #475569;">${htmlBody || 'Message content goes here...'}</div>
                        
                        <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #f1f5f9;">
                            <p style="margin: 0; font-weight: 600; color: #0f172a;">Best Regards,</p>
                            <p style="margin: 4px 0 0 0; color: #F97316; font-weight: 700; display: flex; items-center: center; gap: 4px;">
                                ShineFiling Team
                            </p>
                        </div>
                    </div>
                    <div style="background-color: #f8fafc; padding: 40px 20px; text-align: center; border-top: 1px solid #f1f5f9;">
                        <div style="margin-bottom: 24px;">
                            <a href="https://www.facebook.com/share/1GRAn9XAkP/" target="_blank" style="margin: 0 12px; text-decoration: none; display: inline-block; transition: transform 0.2s;">
                                <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" width="24" height="24" style="vertical-align:middle; opacity: 0.8;">
                            </a>
                            <a href="https://www.instagram.com/shinefiling?igsh=MWk2OTVidzJzdXRvYg==" target="_blank" style="margin: 0 12px; text-decoration: none; display: inline-block; transition: transform 0.2s;">
                                <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="24" height="24" style="vertical-align:middle; opacity: 0.8;">
                            </a>
                            <a href="https://www.linkedin.com/company/shinefiling/" target="_blank" style="margin: 0 12px; text-decoration: none; display: inline-block; transition: transform 0.2s;">
                                <img src="https://cdn-icons-png.flaticon.com/512/3536/3536505.png" width="24" height="24" style="vertical-align:middle; opacity: 0.8;">
                            </a>
                        </div>
                        <div style="font-size: 12px; color: #94a3b8; font-weight: 500;">
                            &copy; 2026 ShineFiling. All rights reserved.
                        </div>
                        <div style="margin-top: 24px; padding: 16px; background-color: #f1f5f9; border-radius: 12px; font-size: 11px; color: #64748b; line-height: 1.6;">
                            <strong>Note:</strong> This is a system auto-generated email. <br>To maintain security, please do not reply to this email directly.
                        </div>
                    </div>
                </div>
            </div>
        `;

        return (
            <div className="flex-1 h-full overflow-hidden flex flex-col">
                <div className="flex-1 overflow-auto bg-slate-100 p-4">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-[600px] mx-auto min-h-full">
                         <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col font-[Roboto,sans-serif] animate-in fade-in duration-500">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Mail className="text-[#F97316]" size={28} /> Marketing <span className="text-slate-300">/</span> Email Templates
                </h2>
                <p className="text-sm text-slate-500 mt-1">Manage professional communication templates for automated system emails.</p>
            </div>

            <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
                <div className="flex-1 flex overflow-hidden">
                    {/* Template List Sidebar */}
                    <div className="w-80 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                            <h3 className="font-bold text-slate-700 dark:text-slate-200 uppercase text-xs tracking-wider">Templates</h3>
                            <button onClick={() => openTemplateEditor()} className="p-1.5 bg-[#F97316]/10 text-[#F97316] rounded-lg hover:bg-[#F97316] hover:text-white transition-all">
                                <Plus size={16} />
                            </button>
                        </div>
                        <div className="p-3">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Search templates..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg outline-none focus:border-[#F97316]"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                            {getFilteredTemplates().map(tpl => (
                                <button 
                                    key={tpl.id} 
                                    onClick={() => openTemplateEditor(tpl)}
                                    className={`w-full p-3 rounded-xl text-left transition-all group ${editingTemplate?.id === tpl.id ? 'bg-[#F97316] text-white shadow-md shadow-orange-500/20' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${editingTemplate?.id === tpl.id ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-600 text-slate-500 dark:text-slate-300'}`}>
                                            {tpl.type}
                                        </span>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span onClick={(e) => { e.stopPropagation(); handleDeleteTemplate(tpl.id); }} className={`p-1 rounded hover:bg-red-500/20 ${editingTemplate?.id === tpl.id ? 'text-white' : 'text-slate-400 hover:text-red-500'}`}>
                                                <Trash2 size={12} />
                                            </span>
                                        </div>
                                    </div>
                                    <p className={`text-sm font-bold truncate ${editingTemplate?.id === tpl.id ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`}>{tpl.name}</p>
                                    <p className={`text-[10px] truncate mt-0.5 ${editingTemplate?.id === tpl.id ? 'text-white/70' : 'text-slate-400'}`}>{tpl.subject || tpl.body.substring(0, 30) + '...'}</p>
                                </button>
                            ))}
                            {getFilteredTemplates().length === 0 && (
                                <div className="p-8 text-center text-slate-400 text-xs italic">No templates found</div>
                            )}
                        </div>
                    </div>

                    {/* Template Content Editor */}
                    <div className="flex-1 flex flex-col bg-white dark:bg-slate-800">
                        <form className="flex-1 flex flex-col" onSubmit={(e) => { e.preventDefault(); handleSaveTemplate(); }}>
                            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                <div className="flex flex-col">
                                    <h4 className="font-bold text-slate-800 dark:text-white">{editingTemplate ? 'Edit Template' : 'New Template'}</h4>
                                    <p className="text-[10px] text-slate-400">Configure your automated communication content</p>
                                </div>
                                    <div className="flex gap-2">
                                        <button 
                                            type="button" 
                                            onClick={() => setShowPreview(!showPreview)}
                                            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${showPreview ? 'bg-indigo-100 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                                        >
                                            <Eye size={16} />
                                            {showPreview ? 'Show Editor' : 'Preview Email'}
                                        </button>
                                        {editingTemplate && !showPreview && (
                                            <button type="button" onClick={() => openTemplateEditor()} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-all">
                                                Cancel
                                            </button>
                                        )}
                                        {!showPreview && (
                                            <button 
                                                type="submit" 
                                                disabled={isSaving}
                                                className="px-6 py-2 bg-[#F97316] text-white text-sm font-bold rounded-lg shadow-lg shadow-orange-500/20 hover:scale-105 transition-all flex items-center gap-2"
                                            >
                                                {isSaving ? <Clock className="animate-spin" size={16} /> : <Save size={16} />}
                                                {editingTemplate ? 'Update' : 'Save Template'}
                                            </button>
                                        )}
                                    </div>
                            </div>

                            {showPreview ? (
                                <EmailPreview title={templateForm.subject || templateForm.name} body={templateForm.body} />
                            ) : (
                                <div className="flex-1 p-6 overflow-y-auto space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Template Name</label>
                                            <input 
                                                type="text" 
                                                required
                                                value={templateForm.name}
                                                onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                                                placeholder="e.g. KYC_APPROVAL"
                                                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-[#F97316] text-sm font-medium"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Template Type</label>
                                            <select 
                                                value={templateForm.type}
                                                onChange={(e) => setTemplateForm({ ...templateForm, type: e.target.value })}
                                                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-[#F97316] text-sm font-medium"
                                            >
                                                <option value="EMAIL">Email</option>
                                                <option value="WHATSAPP">WhatsApp</option>
                                                <option value="SMS">SMS</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Email Subject (Optional)</label>
                                        <input 
                                            type="text" 
                                            value={templateForm.subject}
                                            onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                                            placeholder="Enter email subject"
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-[#F97316] text-sm font-medium"
                                        />
                                    </div>

                                    <div className="space-y-2 flex-1 flex flex-col">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Message Body</label>
                                            <div className="flex gap-1">
                                                {templateForm.variables?.split(',').filter(v => v).map(v => (
                                                    <span key={v} className="text-[10px] bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded font-mono">
                                                        {`{{${v}}}`}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <textarea 
                                            required
                                            value={templateForm.body}
                                            onChange={(e) => setTemplateForm({ ...templateForm, body: e.target.value })}
                                            className="flex-1 w-full p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl outline-none focus:border-[#F97316] text-sm min-h-[300px] font-roboto"
                                            placeholder="Write your email content here. Use {{variable}} for dynamic content."
                                        ></textarea>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Template Variables (Comma separated)</label>
                                            <input 
                                                type="text" 
                                                value={templateForm.variables}
                                                onChange={(e) => setTemplateForm({ ...templateForm, variables: e.target.value })}
                                                placeholder="e.g. name, orderId, reason"
                                                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:border-[#F97316] text-xs font-mono"
                                            />
                                        </div>
                                        <div className="flex items-end justify-end p-2 gap-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-slate-500">Is Active</span>
                                                <input 
                                                    type="checkbox" 
                                                    checked={templateForm.active}
                                                    onChange={(e) => setTemplateForm({ ...templateForm, active: e.target.checked })}
                                                    className="w-5 h-5 rounded border-slate-300 text-[#F97316] focus:ring-[#F97316]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailTemplates;
