
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bold, Italic, List, Link, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string, text: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const RichTextEditor = ({ value, onChange, placeholder, disabled }: RichTextEditorProps) => {
  const [isPreview, setIsPreview] = useState(false);
  const [textValue, setTextValue] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormatting = (prefix: string, suffix: string = '') => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textValue.substring(start, end);
    
    let newText;
    if (selectedText) {
      newText = textValue.substring(0, start) + prefix + selectedText + suffix + textValue.substring(end);
    } else {
      newText = textValue.substring(0, start) + prefix + suffix + textValue.substring(end);
    }
    
    setTextValue(newText);
    convertToHtml(newText);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  };

  const convertToHtml = (text: string) => {
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n/g, '<br>');
    
    // Wrap list items in ul tags
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    
    onChange(html, text);
  };

  const handleTextChange = (newText: string) => {
    setTextValue(newText);
    convertToHtml(newText);
  };

  const renderPreview = () => {
    let html = textValue
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline">$1</a>')
      .replace(/\n/g, '<br>');
    
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul class="list-disc pl-4">$1</ul>');
    
    return <div 
      className="min-h-[120px] p-3 border rounded-md bg-muted/30 prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertFormatting('**', '**')}
            disabled={disabled}
            title="Gras"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertFormatting('*', '*')}
            disabled={disabled}
            title="Italique"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertFormatting('- ')}
            disabled={disabled}
            title="Liste"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertFormatting('[texte](', ')')}
            disabled={disabled}
            title="Lien"
          >
            <Link className="h-4 w-4" />
          </Button>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsPreview(!isPreview)}
          disabled={disabled}
        >
          {isPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {isPreview ? 'Éditer' : 'Aperçu'}
        </Button>
      </div>
      
      {isPreview ? (
        renderPreview()
      ) : (
        <Textarea
          ref={textareaRef}
          value={textValue}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          rows={8}
          className="font-mono text-sm"
        />
      )}
      
      <div className="text-xs text-muted-foreground">
        Formatage: **gras**, *italique*, - liste, [lien](url)
      </div>
    </div>
  );
};
