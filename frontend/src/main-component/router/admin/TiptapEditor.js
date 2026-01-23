import React, { useEffect, useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Box, ButtonGroup, Tooltip } from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  StrikethroughS,
  Title,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Code,
  HorizontalRule,
  Undo,
  Redo,
  Image as ImageIcon,
  Link,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify
} from '@mui/icons-material';

const MenuBar = ({ editor, onImageUpload, isSticky }) => {
  if (!editor) return null;

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        try {
          const imageUrl = await onImageUpload(file);
          if (imageUrl) {
            editor.chain().focus().setImage({ src: imageUrl }).run();
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Failed to upload image. Please try again.');
        }
      }
    };
    
    input.click();
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <Box 
      sx={{ 
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4px',
        p: 1,
        mb: 1,
        borderBottom: 1,
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        borderRadius: '4px 4px 0 0',
        position: isSticky ? 'sticky' : 'static',
        top: 0,
        zIndex: 10,
        boxShadow: isSticky ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
        transition: 'all 0.3s ease',
        backdropFilter: isSticky ? 'blur(8px)' : 'none',
        backgroundColor: isSticky ? 'rgba(255, 255, 255, 0.95)' : 'background.paper',
        '&:hover': {
          backgroundColor: isSticky ? 'background.paper' : 'background.paper',
        }
      }}
    >
      <ButtonGroup variant="outlined" size="small" sx={{ m: 0.5 }}>
        <Tooltip title="Bold">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`menu-button ${editor.isActive('bold') ? 'is-active' : ''}`}
          >
            <FormatBold fontSize="small" />
          </button>
        </Tooltip>
        <Tooltip title="Italic">
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`menu-button ${editor.isActive('italic') ? 'is-active' : ''}`}
          >
            <FormatItalic fontSize="small" />
          </button>
        </Tooltip>
        <Tooltip title="Underline">
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`menu-button ${editor.isActive('underline') ? 'is-active' : ''}`}
          >
            <FormatUnderlined fontSize="small" />
          </button>
        </Tooltip>
        <Tooltip title="Strike">
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`menu-button ${editor.isActive('strike') ? 'is-active' : ''}`}
          >
            <StrikethroughS fontSize="small" />
          </button>
        </Tooltip>
      </ButtonGroup>

      <ButtonGroup variant="outlined" size="small" sx={{ m: 0.5 }}>
        <Tooltip title="Heading 1">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`menu-button ${editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}`}
          >
            <span style={{ fontWeight: 'bold' }}>H1</span>
          </button>
        </Tooltip>
        <Tooltip title="Heading 2">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`menu-button ${editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}`}
          >
            <span style={{ fontWeight: 'bold' }}>H2</span>
          </button>
        </Tooltip>
        <Tooltip title="Heading 3">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`menu-button ${editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}`}
          >
            <span style={{ fontWeight: 'bold' }}>H3</span>
          </button>
        </Tooltip>
      </ButtonGroup>

      <ButtonGroup variant="outlined" size="small" sx={{ m: 0.5 }}>
        <Tooltip title="Bullet List">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`menu-button ${editor.isActive('bulletList') ? 'is-active' : ''}`}
          >
            <FormatListBulleted fontSize="small" />
          </button>
        </Tooltip>
        <Tooltip title="Numbered List">
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`menu-button ${editor.isActive('orderedList') ? 'is-active' : ''}`}
          >
            <FormatListNumbered fontSize="small" />
          </button>
        </Tooltip>
      </ButtonGroup>

      <ButtonGroup variant="outlined" size="small" sx={{ m: 0.5 }}>
        <Tooltip title="Blockquote">
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`menu-button ${editor.isActive('blockquote') ? 'is-active' : ''}`}
          >
            <FormatQuote fontSize="small" />
          </button>
        </Tooltip>
        <Tooltip title="Code Block">
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`menu-button ${editor.isActive('codeBlock') ? 'is-active' : ''}`}
          >
            <Code fontSize="small" />
          </button>
        </Tooltip>
        <Tooltip title="Horizontal Rule">
          <button
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="menu-button"
          >
            <HorizontalRule fontSize="small" />
          </button>
        </Tooltip>
      </ButtonGroup>

      <ButtonGroup variant="outlined" size="small" sx={{ m: 0.5 }}>
        <Tooltip title="Link">
          <button
            onClick={setLink}
            className={`menu-button ${editor.isActive('link') ? 'is-active' : ''}`}
          >
            <Link fontSize="small" />
          </button>
        </Tooltip>
        <Tooltip title="Upload Image">
          <button
            onClick={handleImageUpload}
            className="menu-button"
          >
            <ImageIcon fontSize="small" />
          </button>
        </Tooltip>
      </ButtonGroup>

      <ButtonGroup variant="outlined" size="small" sx={{ m: 0.5 }}>
        <Tooltip title="Undo">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="menu-button"
          >
            <Undo fontSize="small" />
          </button>
        </Tooltip>
        <Tooltip title="Redo">
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="menu-button"
          >
            <Redo fontSize="small" />
          </button>
        </Tooltip>
      </ButtonGroup>
    </Box>
  );
};

const TiptapEditor = ({ content, onUpdate, onImageUpload }) => {
  const [isToolbarSticky, setIsToolbarSticky] = useState(false);
  const editorContainerRef = useRef(null);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: false,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onUpdate(html);
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  useEffect(() => {
    const handleScroll = () => {
      if (editorContainerRef.current) {
        const container = editorContainerRef.current;
        const scrollTop = container.scrollTop;
        
        // Activate sticky toolbar when scrolled more than 10px
        setIsToolbarSticky(scrollTop > 10);
      }
    };

    const editorContainer = editorContainerRef.current;
    if (editorContainer) {
      editorContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (editorContainer) {
        editorContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <Box 
      ref={editorContainerRef}
      sx={{ 
        border: 1, 
        borderColor: 'divider', 
        borderRadius: 1,
        backgroundColor: 'background.paper',
        height: '500px', // Fixed height for scrolling
        overflow: 'auto', // Enable scrolling
        position: 'relative',
        '& .menu-button': {
          minWidth: '32px',
          height: '32px',
          padding: '4px',
          margin: 0,
          border: 'none',
          backgroundColor: 'transparent',
          color: 'text.primary',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'action.hover',
            transform: 'translateY(-1px)',
          },
          '&.is-active': {
            backgroundColor: 'primary.light',
            color: 'primary.contrastText',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          },
          '&:disabled': {
            opacity: 0.5,
            cursor: 'not-allowed',
            transform: 'none',
          },
        },
        '& .ProseMirror': {
          minHeight: 'calc(500px - 60px)', // Account for toolbar height
          padding: '16px',
          '&:focus': {
            outline: 'none'
          },
          // Fix for bullet lists
          '& ul': {
            listStyleType: 'disc',
            paddingLeft: '2rem',
            margin: '1rem 0',
          },
          '& ol': {
            listStyleType: 'decimal',
            paddingLeft: '2rem',
            margin: '1rem 0',
          },
          '& li': {
            marginBottom: '0.5rem',
            paddingLeft: '0.5rem',
            '& p': {
              margin: 0,
            }
          },
          // Nested lists
          '& ul ul, & ol ul': {
            listStyleType: 'circle',
          },
          '& ol ol, & ul ol': {
            listStyleType: 'lower-alpha',
          },
          '& h1': { 
            fontSize: '2em',
            margin: '0.67em 0',
            fontWeight: 'bold',
            color: 'text.primary',
          },
          '& h2': { 
            fontSize: '1.5em',
            margin: '0.75em 0',
            fontWeight: 'bold',
            color: 'text.primary',
          },
          '& h3': { 
            fontSize: '1.17em',
            margin: '0.83em 0',
            fontWeight: 'bold',
            color: 'text.primary',
          },
          '& img': {
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.01)',
            }
          },
          '& blockquote': {
            borderLeft: '4px solid',
            borderColor: 'primary.main',
            paddingLeft: '1.5rem',
            marginLeft: '0',
            fontStyle: 'italic',
            color: 'text.secondary',
            backgroundColor: 'action.hover',
            padding: '1rem',
            borderRadius: '0 8px 8px 0',
          },
          '& code': {
            backgroundColor: 'action.selected',
            borderRadius: '4px',
            padding: '0.2em 0.4em',
            fontSize: '0.9em',
            fontFamily: 'monospace',
          },
          '& pre': {
            backgroundColor: 'background.default',
            padding: '1.2rem',
            borderRadius: '8px',
            overflowX: 'auto',
            border: '1px solid',
            borderColor: 'divider',
            '& code': {
              backgroundColor: 'transparent',
              padding: '0',
            }
          },
          '& hr': {
            border: 'none',
            borderTop: '2px solid',
            borderColor: 'divider',
            margin: '1.5rem 0',
            opacity: 0.5,
          },
          '& a': {
            color: 'primary.main',
            textDecoration: 'none',
            borderBottom: '1px dotted',
            '&:hover': {
              borderBottom: '1px solid',
            }
          }
        }
      }}
    >
      <MenuBar 
        editor={editor} 
        onImageUpload={onImageUpload} 
        isSticky={isToolbarSticky}
      />
      <EditorContent editor={editor} />
    </Box>
  );
};

export default TiptapEditor;