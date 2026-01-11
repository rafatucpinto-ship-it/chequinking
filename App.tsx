
import React, { useState, useCallback, useMemo, useRef } from 'react';
import { INITIAL_EQUIPMENT_DATA } from './constants';
import { EquipmentGroup, ItemStatus } from './types';
import ChecklistGroup from './components/ChecklistGroup';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const App: React.FC = () => {
  const [groups, setGroups] = useState<EquipmentGroup[]>(INITIAL_EQUIPMENT_DATA);
  const [observation, setObservation] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  const reportRef = useRef<HTMLDivElement>(null);

  const today = useMemo(() => {
    return new Date().toLocaleDateString('pt-BR');
  }, []);

  const handleStatusChange = useCallback((groupId: string, itemId: string, status: ItemStatus) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id !== groupId) return group;
        return {
          ...group,
          items: group.items.map((item) =>
            item.id === itemId ? { ...item, status } : item
          ),
        };
      })
    );
  }, []);

  const handlePhotoUpload = (groupId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            setGroups(prev => prev.map(group => {
              if (group.id !== groupId) return group;
              return {
                ...group,
                photos: [...(group.photos || []), ev.target!.result as string]
              };
            }));
          }
        };
        reader.readAsDataURL(file as Blob);
      });
    }
  };

  const removePhoto = (groupId: string, photoIndex: number) => {
    setGroups(prev => prev.map(group => {
      if (group.id !== groupId) return group;
      return {
        ...group,
        photos: group.photos.filter((_, i) => i !== photoIndex)
      };
    }));
  };

  const totalItems = useMemo(() => {
    return groups.reduce((acc, group) => acc + group.items.length, 0);
  }, [groups]);

  const inspectedItems = useMemo(() => {
    return groups.reduce(
      (acc, group) => acc + group.items.filter((i) => i.status !== 'pending').length,
      0
    );
  }, [groups]);

  const progressPercentage = Math.round((inspectedItems / totalItems) * 100);

  // WhatsApp Logic
  const formatWhatsAppMessage = () => {
    let message = `✅ *CHECKLIST DE INSPEÇÃO DE EQUIPAMENTOS*\n`;
    message += `📅 Data: ${today}\n\n`;
    message += `*equipamentos:*\n`;

    groups.forEach((group) => {
      const photoCount = group.photos?.length || 0;
      const photoIcon = photoCount > 0 ? ` 📷(${photoCount})` : '';
      
      message += `${group.icon} *${group.title}*${photoIcon}\n`;
      message += `*Item*\n`;
      message += `*Status*\n`;
      
      group.items.forEach((item, index) => {
        let statusEmoji = '◽';
        if (item.status === 'ok') statusEmoji = '✅';
        if (item.status === 'not_ok') statusEmoji = '❌';
        
        message += `${index + 1}. ${item.label}\n${statusEmoji}\n`;
      });
      message += `\n`;
    });

    if (observation.trim()) {
      message += `⚠️ *Observação*\n`;
      message += `${observation.trim()}`;
    }

    return encodeURIComponent(message);
  };

  const handleSendWhatsApp = () => {
    setIsSending(true);
    const text = formatWhatsAppMessage();
    const url = `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
    setTimeout(() => setIsSending(false), 2000);
  };

  // PDF Logic
  const handleGeneratePDF = async () => {
    if (!reportRef.current) return;
    setIsGeneratingPdf(true);

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / imgHeight;
      const heightInPdf = pdfWidth / ratio;
      
      if (heightInPdf > pdfHeight) {
        const longPdf = new jsPDF('p', 'mm', [pdfWidth, heightInPdf]);
        longPdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, heightInPdf);
        longPdf.save(`checklist-inspecao-${today.replace(/\//g, '-')}.pdf`);
      } else {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, heightInPdf);
        pdf.save(`checklist-inspecao-${today.replace(/\//g, '-')}.pdf`);
      }

    } catch (error) {
      console.error("Error generating PDF", error);
      alert("Erro ao gerar PDF. Tente novamente.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const resetChecklist = () => {
    if (confirm('Deseja realmente limpar todo o checklist?')) {
      setGroups(INITIAL_EQUIPMENT_DATA.map(g => ({
        ...g,
        items: g.items.map(i => ({ ...i, status: 'pending' })),
        photos: []
      })));
      setObservation('');
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen pb-40">
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-4">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-lg font-black text-slate-900 leading-tight uppercase tracking-tight">
            Checklist de Inspeção
          </h1>
          <button 
            onClick={resetChecklist}
            className="text-[10px] font-bold text-red-500 hover:bg-red-50 px-2 py-1 rounded transition-colors uppercase border border-red-100"
          >
            Limpar
          </button>
        </div>
        <div className="flex items-center gap-3 mb-1">
          <div className="flex-1 bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
            <div 
              className={`h-full transition-all duration-700 ease-out ${
                progressPercentage === 100 ? 'bg-green-500' : 'bg-blue-600'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="text-xs font-black text-slate-700 min-w-[35px]">
            {progressPercentage}%
          </span>
        </div>
        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          Inspeção Diária • {today}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 space-y-4">
        <section>
          {groups.map((group) => (
            <ChecklistGroup 
              key={group.id} 
              group={group} 
              onStatusChange={handleStatusChange} 
              onAddPhoto={handlePhotoUpload}
              onRemovePhoto={removePhoto}
            />
          ))}
        </section>

        {/* Observations Section */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider">Observações</h3>
          </div>
          <div className="p-4">
            <textarea
              placeholder="Ex: O cabo console encontra-se dentro da camionete..."
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              className="w-full h-32 p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none font-medium placeholder:text-slate-300"
            />
          </div>
        </section>
      </main>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 z-30">
        <div className="max-w-md mx-auto grid grid-cols-2 gap-3">
          <button
            onClick={handleGeneratePDF}
            disabled={isGeneratingPdf}
            className={`
              flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-700 border border-slate-300 bg-white hover:bg-slate-50 active:scale-95 transition-all
              ${isGeneratingPdf ? 'opacity-50 cursor-wait' : ''}
            `}
          >
            {isGeneratingPdf ? 'Gerando...' : '📄 Baixar PDF'}
          </button>
          
          <button
            onClick={handleSendWhatsApp}
            disabled={isSending}
            className={`
              flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#25D366] hover:bg-[#128C7E] active:scale-95 transition-all shadow-lg shadow-green-100
              ${isSending ? 'opacity-70' : ''}
            `}
          >
            {isSending ? 'Abrindo...' : '💬 WhatsApp'}
          </button>
        </div>
      </div>

      {/* Hidden Report Template (Visible only for html2canvas) */}
      <div className="fixed top-0 left-[-9999px] w-[794px] bg-white text-black p-10" ref={reportRef}>
        <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold uppercase">Relatório de Inspeção</h1>
            <p className="text-sm text-gray-600 mt-1">Checklist de Equipamentos</p>
          </div>
          <div className="text-right">
            <p className="font-bold">Data: {today}</p>
            <p className="text-sm text-gray-500">Status Geral: {progressPercentage}%</p>
          </div>
        </div>

        <div className="space-y-6">
          {groups.map((group) => (
            <div key={group.id} className="mb-4">
              <h3 className="font-bold text-lg border-b border-gray-300 pb-1 mb-2 flex items-center gap-2">
                <span>{group.icon}</span> {group.title}
              </h3>
              <table className="w-full text-sm text-left mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 w-3/4">Item</th>
                    <th className="p-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {group.items.map((item, idx) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="p-2">{idx + 1}. {item.label}</td>
                      <td className="p-2 text-center font-bold">
                        {item.status === 'ok' && <span className="text-green-600">CONFORME</span>}
                        {item.status === 'not_ok' && <span className="text-red-600">NÃO CONFORME</span>}
                        {item.status === 'pending' && <span className="text-gray-400">PENDENTE</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Group Photos in PDF */}
              {group.photos && group.photos.length > 0 && (
                <div className="bg-slate-50 p-3 rounded border border-slate-200">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-2">Evidências Fotográficas:</p>
                  <div className="grid grid-cols-4 gap-3">
                    {group.photos.map((photo, pIdx) => (
                      <div key={pIdx} className="aspect-square bg-white border border-gray-200 rounded overflow-hidden">
                        <img src={photo} alt={`Foto ${pIdx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {observation && (
          <div className="mt-8 break-inside-avoid">
            <h3 className="font-bold text-lg border-b border-gray-300 pb-1 mb-2">Observações Gerais</h3>
            <div className="bg-gray-50 p-4 rounded border border-gray-200 text-sm">
              {observation}
            </div>
          </div>
        )}
        
        <div className="mt-12 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
          Relatório gerado automaticamente em {new Date().toLocaleString('pt-BR')}
        </div>
      </div>

    </div>
  );
};

export default App;
