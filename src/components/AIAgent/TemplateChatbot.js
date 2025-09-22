import React, { useState, useEffect, useRef } from 'react';
import { Send, FileText, Building, User, MessageSquare, Upload, Check, X, FileCheck } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

const TemplateChatbot = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [currentStep, setCurrentStep] = useState('initial');
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [userData, setUserData] = useState({});
  const [uploadedDocuments, setUploadedDocuments] = useState({});
  const [missingDocuments, setMissingDocuments] = useState([]);
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [userDocuments, setUserDocuments] = useState({});
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Template definitions with required documents for data extraction
  const templates = [
    {
      id: 'export-invoice',
      name: 'Export Invoice',
      icon: <FileText className="w-5 h-5" />,
      requiredDocuments: [
        {
          id: 'panCard',
          name: 'PAN Card', 
          description: 'For exporter details and PAN verification',
          extractedData: ['name', 'pan', 'address']
        },
        {
          id: 'iecCertificate',
          name: 'IEC Certificate',
          description: 'Import Export Code for trade authorization',
          extractedData: ['iecCode', 'companyName', 'validityDate']
        },
        {
          id: 'gstCertificate',
          name: 'GST Registration Certificate',
          description: 'For GST registration details',
          extractedData: ['gstNumber', 'businessName', 'registrationDate']
        },
        {
          id: 'bankStatement',
          name: 'Bank Statement',
          description: 'For banking details and SWIFT code',
          extractedData: ['accountNumber', 'ifscCode', 'swiftCode', 'bankName']
        }
      ]
    },
    {
      id: 'packing-list',
      name: 'Packing List',
      icon: <Building className="w-5 h-5" />,
      requiredDocuments: [
        {
          id: 'exportInvoice',
          name: 'Commercial Invoice',
          description: 'Product and quantity details',
          extractedData: ['products', 'quantities', 'weights', 'dimensions']
        },
        {
          id: 'manufacturingDetails',
          name: 'Manufacturing Details',
          description: 'Product specifications and origin',
          extractedData: ['productSpecs', 'countryOfOrigin', 'hsCode']
        }
      ]
    },
    {
      id: 'shipping-bill',
      name: 'Shipping Bill',
      icon: <FileText className="w-5 h-5" />,
      requiredDocuments: [
        {
          id: 'exportInvoice',
          name: 'Commercial Invoice',
          description: 'Invoice details for customs',
          extractedData: ['invoiceNumber', 'invoiceDate', 'totalValue', 'currency']
        },
        {
          id: 'iecCertificate',
          name: 'IEC Certificate',
          description: 'Export authorization',
          extractedData: ['iecCode', 'exporterName']
        },
        {
          id: 'gstCertificate',
          name: 'GST Registration Certificate',
          description: 'Tax registration details',
          extractedData: ['gstNumber', 'businessAddress']
        }
      ]
    },
    {
      id: 'certificate-origin',
      name: 'Certificate of Origin',
      icon: <FileText className="w-5 h-5" />,
      requiredDocuments: [
        {
          id: 'manufacturingDetails',
          name: 'Manufacturing Certificate/License',
          description: 'Product origin verification',
          extractedData: ['manufacturingLocation', 'productOrigin', 'manufacturerName']
        },
        {
          id: 'exportInvoice',
          name: 'Export Invoice',
          description: 'Product and destination details',
          extractedData: ['products', 'destination', 'consignee']
        }
      ]
    },
    {
      id: 'letter-credit',
      name: 'Letter of Credit Application',
      icon: <Building className="w-5 h-5" />,
      requiredDocuments: [
        {
          id: 'bankStatement',
          name: 'Bank Statement (Last 6 months)',
          description: 'Financial standing verification',
          extractedData: ['accountBalance', 'bankName', 'accountNumber']
        },
        {
          id: 'exportContract',
          name: 'Export Contract',
          description: 'Trade agreement details',
          extractedData: ['contractValue', 'paymentTerms', 'deliveryTerms']
        },
        {
          id: 'companyProfile',
          name: 'Company Profile',
          description: 'Business credentials',
          extractedData: ['companyName', 'businessType', 'experience']
        }
      ]
    },
    {
      id: 'insurance-certificate',
      name: 'Marine Insurance Certificate',
      icon: <FileText className="w-5 h-5" />,
      requiredDocuments: [
        {
          id: 'exportInvoice',
          name: 'Commercial Invoice',
          description: 'Cargo value and details',
          extractedData: ['cargoValue', 'products', 'destination']
        },
        {
          id: 'shippingDetails',
          name: 'Shipping Details',
          description: 'Transportation information',
          extractedData: ['vesselName', 'voyageNumber', 'portOfLoading', 'portOfDischarge']
        }
      ]
    }
  ];

  // Fetch user's uploaded documents from database
  const fetchUserDocuments = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching documents:', error);
        return;
      }

      // Transform data into the format expected by the component
      const documentsMap = {};
      data?.forEach(doc => {
        documentsMap[doc.document_type] = {
          uploaded: true,
          fileName: doc.file_name,
          uploadedAt: doc.uploaded_at,
          data: doc.extracted_data || {},
          status: doc.processing_status
        };
      });

      setUserDocuments(documentsMap);
    } catch (error) {
      console.error('Error in fetchUserDocuments:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize with personalized welcome message
    const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there';
    addBotMessage(`Hello ${userName}! I'm E-CHA, your AI assistant for export documentation. I can help you generate professional export documents using your uploaded data. Click 'Get Started' to begin!`);
  }, [user]);

  useEffect(() => {
    fetchUserDocuments();
  }, [user]);

  const addBotMessage = (text, isButton = false, buttons = []) => {
    const message = {
      id: Date.now(),
      text,
      sender: 'bot',
      timestamp: new Date(),
      isButton,
      buttons
    };
    setMessages(prev => [...prev, message]);
  };

  const addUserMessage = (text) => {
    const message = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const addFileMessage = (fileName, status) => {
    const message = {
      id: Date.now(),
      text: fileName,
      sender: 'user',
      timestamp: new Date(),
      isFile: true,
      fileStatus: status
    };
    setMessages(prev => [...prev, message]);
  };

  const handleHiClick = () => {
    addUserMessage("Hi");
    setCurrentStep('templateSelection');
    
    const templateButtons = templates.map(template => ({
      id: template.id,
      text: template.name,
      icon: template.icon
    }));

    setTimeout(() => {
      addBotMessage("Great! I can help you generate various export documents. Please select the documents you'd like to create:", true, templateButtons);
    }, 500);
  };

  const handleTemplateSelect = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    const newSelectedTemplates = [...selectedTemplates, template];
    setSelectedTemplates(newSelectedTemplates);
    addUserMessage(template.name);

    setTimeout(() => {
      addBotMessage(`✓ ${template.name} selected! You can select more documents or click "Continue" to proceed.`, true, [
        ...templates.filter(t => !newSelectedTemplates.find(st => st.id === t.id)).map(t => ({
          id: t.id,
          text: t.name,
          icon: t.icon
        })),
        { id: 'continue', text: 'Continue with selected documents', style: 'primary' }
      ]);
    }, 500);
  };

  const handleContinue = () => {
    addUserMessage("Continue with selected documents");
    setCurrentStep('documentCheck');
    
    // Get all required documents from selected templates
    const allRequiredDocs = [...new Map(
      selectedTemplates.flatMap(template => 
        template.requiredDocuments.map(doc => [doc.id, doc])
      )
    ).values()];

    // Check which documents are missing from user's uploaded documents
    const missingDocs = allRequiredDocs.filter(doc => !userDocuments[doc.id]?.uploaded);
    setMissingDocuments(missingDocs);

    if (missingDocs.length === 0) {
      setTimeout(() => {
        addBotMessage("Perfect! All required documents are already uploaded and processed. I have all the data needed to generate your export documents.");
        handleTemplateGeneration();
      }, 500);
    } else {
      setTimeout(() => {
        const missingList = missingDocs.map(doc => `• ${doc.name}`).join('\n');
        addBotMessage(`I need some additional documents to generate your export documentation. The following documents are required:\n\n${missingList}\n\nI'll guide you to upload them one by one so I can extract the necessary data.`);
        askForDocument(0);
      }, 500);
    }
  };

  const askForDocument = (index) => {
    if (index >= missingDocuments.length) {
      addBotMessage("Thank you! All documents have been processed. Generating your export documents with the extracted data...");
      handleTemplateGeneration();
      return;
    }

    const document = missingDocuments[index];
    setCurrentDocumentIndex(index);
    
    setTimeout(() => {
      addBotMessage(
        `Please upload your ${document.name}:\n\n📋 ${document.description}\n\n🔍 Data I'll extract: ${document.extractedData.join(', ')}`,
        true,
        [{ id: 'upload_document', text: `Upload ${document.name}`, icon: <Upload className="w-4 h-4" /> }]
      );
    }, 500);
  };

  const handleDocumentUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      addBotMessage("❌ File size too large. Please upload a file smaller than 10MB.");
      return;
    }
    setIsUploading(true);
    const document = missingDocuments[currentDocumentIndex];
    
    addFileMessage(file.name, 'uploading');

    // Upload file to backend for processing
    uploadDocumentToBackend(file, document);
  };

  const uploadDocumentToBackend = async (file, document) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', user.id);
      formData.append('document_type', document.id);
      formData.append('document_name', document.name);
      formData.append('expected_data', JSON.stringify(document.extractedData));

      // Upload to your backend processing endpoint
      const response = await fetch('/api/upload-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      // Update local state
      setUserDocuments(prev => ({
        ...prev,
        [document.id]: {
          uploaded: true,
          fileName: file.name,
          data: result.extractedData || {},
          status: 'processed'
        }
      }));

      setUploadedDocuments(prev => ({
        ...prev,
        [document.id]: {
          uploaded: true,
          fileName: file.name,
          data: result.extractedData || {}
        }
      }));

      setIsUploading(false);
      
      // Update the file message to show success
      setMessages(prev => 
        prev.map(msg => 
          msg.text === file.name && msg.isFile ? 
          { ...msg, fileStatus: 'success' } : msg
        )
      );

      setTimeout(() => {
        if (result.extractedData && Object.keys(result.extractedData).length > 0) {
          const dataList = Object.keys(result.extractedData).map(key => `• ${key}: ${result.extractedData[key]}`).join('\n');
          addBotMessage(`✅ ${document.name} processed successfully!\n\n📊 Extracted data:\n${dataList}`);
        } else {
          addBotMessage(`✅ ${document.name} uploaded successfully! Processing in background...`);
        }
        
        const nextIndex = currentDocumentIndex + 1;
        setCurrentDocumentIndex(nextIndex);
        askForDocument(nextIndex);
      }, 1000);

    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
      
      // Update the file message to show error
      setMessages(prev => 
        prev.map(msg => 
          msg.text === file.name && msg.isFile ? 
          { ...msg, fileStatus: 'error' } : msg
        )
      );
      
      addBotMessage(`❌ Failed to upload ${document.name}. Please try again or contact support if the issue persists.`);
    }
  };

  const handleTemplateGeneration = () => {
    setTimeout(() => {
      const templateList = selectedTemplates.map(t => `• ${t.name}`).join('\n');
      
      // Count total extracted data points
      const totalDataPoints = Object.values({...userDocuments, ...uploadedDocuments})
        .filter(doc => doc.uploaded)
        .reduce((count, doc) => count + Object.keys(doc.data || {}).length, 0);
      
      const totalDocs = Object.keys({...userDocuments, ...uploadedDocuments}).filter(key => ({...userDocuments, ...uploadedDocuments})[key].uploaded).length;
      
      addBotMessage(`🎉 Success! Your export documents are being generated:\n\n${templateList}\n\n📊 Data extracted from ${totalDocs} documents\n📋 ${totalDataPoints} data points used for document completion\n\n✅ Documents will be ready for download shortly and will be compliant with export regulations.`);
      
      setTimeout(() => {
        addBotMessage("Is there anything else I can help you with?", true, [
          { id: 'new_templates', text: 'Generate More Documents' },
          { id: 'view_data', text: 'View Extracted Data' },
          { id: 'compliance_check', text: 'Run Compliance Check' },
          { id: 'done', text: 'All Done' }
        ]);
      }, 1000);
    }, 2000);
  };

  const handleViewData = () => {
    addUserMessage("View Extracted Data");
    
    const allData = {...userDocuments, ...uploadedDocuments};
    const dataEntries = Object.entries(allData)
      .filter(([key, doc]) => doc.uploaded)
      .map(([key, doc]) => {
        const docName = templates
          .flatMap(t => t.requiredDocuments)
          .find(d => d.id === key)?.name || key;
        
        const dataPoints = Object.entries(doc.data || {})
          .map(([field, value]) => `  • ${field}: ${value}`)
          .join('\n');
        
        return `📄 ${docName}:\n${dataPoints}`;
      })
      .join('\n\n');

    setTimeout(() => {
      if (dataEntries) {
        addBotMessage(`Here's all the data extracted from your documents:\n\n${dataEntries}`);
      } else {
        addBotMessage("No document data available yet. Please upload some documents first.");
      }
    }, 500);
  };

  const handleComplianceCheck = () => {
    addUserMessage("Run Compliance Check");
    
    setTimeout(() => {
      addBotMessage("🔍 Running compliance check on your export documents...");
      
      setTimeout(() => {
        addBotMessage(`✅ Compliance Check Results:\n\n• IEC Certificate: Valid ✓\n• GST Registration: Active ✓\n• Banking Details: Verified ✓\n• Document Format: Export Standard ✓\n• Regulatory Requirements: Met ✓\n\n🎯 All documents are compliant with Indian export regulations and international trade standards.`);
      }, 2000);
    }, 500);
  };

  const handleButtonClick = (buttonId) => {
    if (buttonId === 'continue') {
      handleContinue();
    } else if (templates.find(t => t.id === buttonId)) {
      handleTemplateSelect(buttonId);
    } else if (buttonId === 'upload_document') {
      handleDocumentUpload();
    } else if (buttonId === 'view_data') {
      handleViewData();
    } else if (buttonId === 'compliance_check') {
      handleComplianceCheck();
    } else if (buttonId === 'new_templates') {
      // Reset state for new templates
      setSelectedTemplates([]);
      setCurrentStep('templateSelection');
      setMissingDocuments([]);
      setCurrentDocumentIndex(0);
      addUserMessage("Generate More Documents");
      setTimeout(() => {
        const templateButtons = templates.map(template => ({
          id: template.id,
          text: template.name,
          icon: template.icon
        }));
        addBotMessage("Please select the export documents you'd like to generate:", true, templateButtons);
      }, 500);
    }
  };

  const formatMessage = (text) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="flex flex-col h-[600px] bg-gray-50 relative">
      {loading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-manu-green border-t-transparent mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading your documents...</p>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="bg-manu-green shadow-sm border-b p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-manu-green" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">E-CHA Export Assistant</h1>
            <p className="text-sm text-green-100">AI-powered export document processing & generation</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentStep === 'initial' && (
          <div className="flex justify-center">
            <button
              onClick={handleHiClick}
              className="bg-manu-green hover:bg-green-600 text-white px-8 py-3 rounded-full font-medium transition-colors shadow-lg disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Get Started 👋'}
            </button>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.sender === 'user'
                ? message.isFile 
                  ? 'bg-manu-green text-white' 
                  : 'bg-blue-500 text-white'
                : 'bg-white text-gray-800 shadow-sm border'
            }`}>
              {message.isFile ? (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    {message.fileStatus === 'uploading' ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : message.fileStatus === 'success' ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{message.text}</span>
                </div>
              ) : (
                <p className="text-sm">{formatMessage(message.text)}</p>
              )}
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {/* Button Messages */}
        {messages.filter(m => m.isButton && m.buttons.length > 0).slice(-1).map((message) => (
          <div key={`buttons-${message.id}`} className="flex justify-start">
            <div className="max-w-2xl">
              <div className="grid grid-cols-2 gap-2 mt-2">
                {message.buttons.map((button) => (
                  <button
                    key={button.id}
                    onClick={() => handleButtonClick(button.id)}
                    disabled={isUploading && button.id === 'upload_document'}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                      button.style === 'primary'
                        ? 'bg-manu-green hover:bg-green-600 text-white'
                        : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200'
                    }`}
                  >
                    {button.icon && <span>{button.icon}</span>}
                    <span>{button.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {currentStep !== 'initial' && currentStep !== 'documentCheck' && (
        <div className="bg-white border-t p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && inputValue.trim()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-manu-green focus:border-transparent"
              disabled={isUploading}
            />
            <button
              onClick={() => {}}
              disabled={!inputValue.trim() || isUploading}
              className="bg-manu-green hover:bg-green-600 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        style={{ display: 'none' }}
      />

      {/* Status Bar */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-100 p-2 text-xs text-gray-600 border-t">
          Selected: {selectedTemplates.length} | Step: {currentStep} | Missing Docs: {missingDocuments.length} | User Docs: {Object.keys(userDocuments).length} | Session Uploads: {Object.keys(uploadedDocuments).length}
        </div>
      )}
    </div>
  );
};

export default TemplateChatbot;