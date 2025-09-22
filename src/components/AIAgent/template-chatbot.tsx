import React, { useState, useEffect, useRef } from 'react';
import { Send, FileText, Building, User, MessageSquare, Upload, Check, X, FileCheck } from 'lucide-react';

const TemplateChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [currentStep, setCurrentStep] = useState('initial');
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [userData, setUserData] = useState({});
  const [uploadedDocuments, setUploadedDocuments] = useState({});
  const [missingDocuments, setMissingDocuments] = useState([]);
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Mock database - extracted data from previously uploaded documents
  const existingDocumentData = {
    panCard: {
      uploaded: true,
      data: {
        name: "John Doe",
        pan: "ABCDE1234F",
        fatherName: "Robert Doe",
        dateOfBirth: "1990-01-15"
      }
    },
    aadhaarCard: {
      uploaded: true,
      data: {
        name: "John Doe",
        aadhaar: "1234-5678-9012",
        address: "123 Main Street, Mumbai, Maharashtra 400001",
        dateOfBirth: "1990-01-15"
      }
    },
    // bankStatement: { uploaded: false, data: null },
    // form16: { uploaded: false, data: null },
    // incorporationCertificate: { uploaded: false, data: null }
  };

  // Template definitions with required documents for data extraction
  const templates = [
    {
      id: 'incorporation',
      name: 'Company Incorporation',
      icon: <Building className="w-5 h-5" />,
      requiredDocuments: [
        {
          id: 'panCard',
          name: 'PAN Card',
          description: 'For director details and PAN verification',
          extractedData: ['name', 'pan', 'fatherName', 'dateOfBirth']
        },
        {
          id: 'aadhaarCard',
          name: 'Aadhaar Card',
          description: 'For identity and address verification',
          extractedData: ['name', 'aadhaar', 'address', 'dateOfBirth']
        },
        {
          id: 'addressProof',
          name: 'Address Proof',
          description: 'Business address verification',
          extractedData: ['businessAddress', 'pincode', 'state']
        },
        {
          id: 'bankStatement',
          name: 'Bank Statement',
          description: 'For financial verification',
          extractedData: ['accountNumber', 'ifscCode', 'bankName', 'balance']
        }
      ]
    },
    {
      id: 'gst',
      name: 'GST Registration',
      icon: <FileText className="w-5 h-5" />,
      requiredDocuments: [
        {
          id: 'panCard',
          name: 'PAN Card',
          description: 'For PAN verification',
          extractedData: ['name', 'pan']
        },
        {
          id: 'incorporationCertificate',
          name: 'Incorporation Certificate',
          description: 'Company registration details',
          extractedData: ['companyName', 'cin', 'dateOfIncorporation']
        },
        {
          id: 'bankStatement',
          name: 'Bank Statement',
          description: 'Banking details',
          extractedData: ['accountNumber', 'ifscCode', 'bankName']
        },
        {
          id: 'rentAgreement',
          name: 'Rent Agreement',
          description: 'Business premises proof',
          extractedData: ['businessAddress', 'rent', 'landlordDetails']
        }
      ]
    },
    {
      id: 'tax',
      name: 'Tax Filing',
      icon: <FileText className="w-5 h-5" />,
      requiredDocuments: [
        {
          id: 'panCard',
          name: 'PAN Card',
          description: 'For PAN details',
          extractedData: ['name', 'pan', 'dateOfBirth']
        },
        {
          id: 'form16',
          name: 'Form 16',
          description: 'Salary and TDS details',
          extractedData: ['salary', 'tdsAmount', 'employerName', 'financialYear']
        },
        {
          id: 'bankStatement',
          name: 'Bank Statement',
          description: 'Interest and transaction details',
          extractedData: ['interestEarned', 'accountNumber', 'bankName']
        },
        {
          id: 'investmentProofs',
          name: 'Investment Proofs',
          description: '80C, 80D investment details',
          extractedData: ['section80C', 'section80D', 'otherInvestments']
        }
      ]
    },
    {
      id: 'compliance',
      name: 'Compliance Report',
      icon: <FileText className="w-5 h-5" />,
      requiredDocuments: [
        {
          id: 'incorporationCertificate',
          name: 'Incorporation Certificate',
          description: 'Company basic details',
          extractedData: ['companyName', 'cin', 'dateOfIncorporation']
        },
        {
          id: 'financialStatements',
          name: 'Financial Statements',
          description: 'P&L and Balance Sheet',
          extractedData: ['revenue', 'profit', 'assets', 'liabilities']
        },
        {
          id: 'boardResolutions',
          name: 'Board Resolutions',
          description: 'Board meeting decisions',
          extractedData: ['resolutionDate', 'decisions', 'directorNames']
        }
      ]
    },
    {
      id: 'audit',
      name: 'Audit Report',
      icon: <FileText className="w-5 h-5" />,
      requiredDocuments: [
        {
          id: 'financialStatements',
          name: 'Financial Statements',
          description: 'Complete financial data',
          extractedData: ['revenue', 'expenses', 'profit', 'assets', 'liabilities']
        },
        {
          id: 'trialBalance',
          name: 'Trial Balance',
          description: 'Account balances',
          extractedData: ['accountBalances', 'totalDebits', 'totalCredits']
        },
        {
          id: 'bankStatement',
          name: 'Bank Statement',
          description: 'Banking transactions',
          extractedData: ['transactions', 'closingBalance', 'accountNumber']
        }
      ]
    },
    {
      id: 'agreement',
      name: 'Legal Agreement',
      icon: <FileText className="w-5 h-5" />,
      requiredDocuments: [
        {
          id: 'panCard',
          name: 'PAN Card',
          description: 'Identity verification',
          extractedData: ['name', 'pan', 'fatherName']
        },
        {
          id: 'aadhaarCard',
          name: 'Aadhaar Card',
          description: 'Address and identity proof',
          extractedData: ['name', 'aadhaar', 'address']
        },
        {
          id: 'incorporationCertificate',
          name: 'Incorporation Certificate',
          description: 'Company authorization',
          extractedData: ['companyName', 'cin', 'registeredAddress']
        }
      ]
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize with welcome message
    addBotMessage("Hello! I'm your AI assistant for generating legal and business templates. Click 'Hi' to get started!");
  }, []);

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
      addBotMessage("Great! Please select the templates you'd like to generate:", true, templateButtons);
    }, 500);
  };

  const handleTemplateSelect = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    const newSelectedTemplates = [...selectedTemplates, template];
    setSelectedTemplates(newSelectedTemplates);
    addUserMessage(template.name);

    setTimeout(() => {
      addBotMessage(`✓ ${template.name} selected! You can select more templates or click "Continue" to proceed.`, true, [
        ...templates.filter(t => !newSelectedTemplates.find(st => st.id === t.id)).map(t => ({
          id: t.id,
          text: t.name,
          icon: t.icon
        })),
        { id: 'continue', text: 'Continue with selected templates', style: 'primary' }
      ]);
    }, 500);
  };

  const handleContinue = () => {
    addUserMessage("Continue with selected templates");
    setCurrentStep('documentCheck');
    
    // Get all required documents from selected templates
    const allRequiredDocs = [...new Map(
      selectedTemplates.flatMap(template => 
        template.requiredDocuments.map(doc => [doc.id, doc])
      )
    ).values()];

    // Check which documents are missing
    const missingDocs = allRequiredDocs.filter(doc => !existingDocumentData[doc.id]?.uploaded);
    setMissingDocuments(missingDocs);

    if (missingDocs.length === 0) {
      setTimeout(() => {
        addBotMessage("Perfect! All required documents are already uploaded and processed. Generating your templates with extracted data...");
        handleTemplateGeneration();
      }, 500);
    } else {
      setTimeout(() => {
        const missingList = missingDocs.map(doc => `• ${doc.name}`).join('\n');
        addBotMessage(`I need to extract data from some documents for your templates. The following documents are missing:\n\n${missingList}\n\nI'll ask you to upload them one by one.`);
        askForDocument(0);
      }, 500);
    }
  };

  const askForDocument = (index) => {
    if (index >= missingDocuments.length) {
      addBotMessage("Thank you! All documents have been processed. Generating your templates with the extracted data...");
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

    setIsUploading(true);
    const document = missingDocuments[currentDocumentIndex];
    
    addFileMessage(file.name, 'uploading');

    // Simulate document processing and data extraction
    setTimeout(() => {
      // Mock extracted data based on document type
      let extractedData = {};
      if (document.id === 'form16') {
        extractedData = {
          salary: "500000",
          tdsAmount: "12500",
          employerName: "Tech Corp Ltd",
          financialYear: "2023-24"
        };
      } else if (document.id === 'bankStatement') {
        extractedData = {
          accountNumber: "1234567890",
          ifscCode: "HDFC0001234",
          bankName: "HDFC Bank",
          interestEarned: "2500"
        };
      } else if (document.id === 'incorporationCertificate') {
        extractedData = {
          companyName: "Tech Corp Ltd",
          cin: "U12345AB2020PTC123456",
          dateOfIncorporation: "2020-05-15"
        };
      }

      // Update uploaded documents
      setUploadedDocuments(prev => ({
        ...prev,
        [document.id]: {
          uploaded: true,
          fileName: file.name,
          data: extractedData
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
        const dataList = Object.keys(extractedData).map(key => `• ${key}: ${extractedData[key]}`).join('\n');
        addBotMessage(`✅ ${document.name} processed successfully!\n\n📊 Extracted data:\n${dataList}`);
        
        const nextIndex = currentDocumentIndex + 1;
        setCurrentDocumentIndex(nextIndex);
        askForDocument(nextIndex);
      }, 1000);

    }, 3000); // Simulate processing time
  };

  const handleTemplateGeneration = () => {
    setTimeout(() => {
      const templateList = selectedTemplates.map(t => `• ${t.name}`).join('\n');
      
      // Count total extracted data points
      const totalDataPoints = Object.values({...existingDocumentData, ...uploadedDocuments})
        .filter(doc => doc.uploaded)
        .reduce((count, doc) => count + Object.keys(doc.data || {}).length, 0);
      
      addBotMessage(`🎉 Success! Your templates have been generated:\n\n${templateList}\n\n📊 Data extracted from ${Object.keys({...existingDocumentData, ...uploadedDocuments}).filter(key => ({...existingDocumentData, ...uploadedDocuments})[key].uploaded).length} documents\n📋 ${totalDataPoints} data points used for template completion\n\n✅ All templates are ready for download from your dashboard.`);
      
      setTimeout(() => {
        addBotMessage("Is there anything else I can help you with?", true, [
          { id: 'new_templates', text: 'Generate More Templates' },
          { id: 'view_data', text: 'View Extracted Data' },
          { id: 'done', text: 'All Done' }
        ]);
      }, 1000);
    }, 2000);
  };

  const handleViewData = () => {
    addUserMessage("View Extracted Data");
    
    const allData = {...existingDocumentData, ...uploadedDocuments};
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
      addBotMessage(`Here's all the data extracted from your documents:\n\n${dataEntries}`);
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
    } else if (buttonId === 'new_templates') {
      // Reset state for new templates
      setSelectedTemplates([]);
      setCurrentStep('templateSelection');
      setMissingDocuments([]);
      setCurrentDocumentIndex(0);
      addUserMessage("Generate More Templates");
      setTimeout(() => {
        const templateButtons = templates.map(template => ({
          id: template.id,
          text: template.name,
          icon: template.icon
        }));
        addBotMessage("Please select the templates you'd like to generate:", true, templateButtons);
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
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Template Assistant</h1>
            <p className="text-sm text-gray-500">AI-powered document processing & template generation</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentStep === 'initial' && (
          <div className="flex justify-center">
            <button
              onClick={handleHiClick}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-medium transition-colors shadow-lg"
            >
              Hi 👋
            </button>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.sender === 'user'
                ? message.isFile 
                  ? 'bg-green-500 text-white' 
                  : 'bg-blue-500 text-white'
                : 'bg-white text-gray-800 shadow-sm'
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
            <div className="max-w-md">
              <div className="grid grid-cols-2 gap-2 mt-2">
                {message.buttons.map((button) => (
                  <button
                    key={button.id}
                    onClick={() => handleButtonClick(button.id)}
                    disabled={isUploading && button.id === 'upload_document'}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                      button.style === 'primary'
                        ? 'bg-green-500 hover:bg-green-600 text-white'
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
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isUploading}
            />
            <button
              onClick={() => {}}
              disabled={!inputValue.trim() || isUploading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
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

      {/* Debug Info */}
      <div className="bg-gray-100 p-2 text-xs text-gray-600">
        Selected: {selectedTemplates.length} | Step: {currentStep} | Missing Docs: {missingDocuments.length} | Uploaded: {Object.keys(uploadedDocuments).length}
      </div>
    </div>
  );
};

export default TemplateChatbot;