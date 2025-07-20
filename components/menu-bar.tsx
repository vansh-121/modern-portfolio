"use client"

import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  ListOrdered,
  ListOrderedIcon as ListUnordered,
  Code,
  Image,
  Link,
  Quote,
  SeparatorHorizontal,
  Redo,
  Undo,
  Download,
  Copy,
  Trash,
  Plus,
  Text,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { VoiceControlIndicator } from "@/components/voice-control-indicator"

interface MenuBarProps {
  onBoldClick: () => void
  onItalicClick: () => void
  onUnderlineClick: () => void
  onAlignLeftClick: () => void
  onAlignCenterClick: () => void
  onAlignRightClick: () => void
  onOrderedListClick: () => void
  onUnorderedListClick: () => void
  onCodeClick: () => void
  onImageClick: () => void
  onLinkClick: () => void
  onQuoteClick: () => void
  onSeparatorClick: () => void
  onRedoClick: () => void
  onUndoClick: () => void
  onDownloadClick: () => void
  onCopyClick: () => void
  onTrashClick: () => void
  onAddClick: () => void
  onTextClick: () => void
  onHeading1Click: () => void
  onHeading2Click: () => void
  onHeading3Click: () => void
  onHeading4Click: () => void
  onHeading5Click: () => void
  onHeading6Click: () => void
  voiceControl?: import("@/hooks/use-voice-control").UseVoiceControlReturn
}

export function MenuBar({
  onBoldClick,
  onItalicClick,
  onUnderlineClick,
  onAlignLeftClick,
  onAlignCenterClick,
  onAlignRightClick,
  onOrderedListClick,
  onUnorderedListClick,
  onCodeClick,
  onImageClick,
  onLinkClick,
  onQuoteClick,
  onSeparatorClick,
  onRedoClick,
  onUndoClick,
  onDownloadClick,
  onCopyClick,
  onTrashClick,
  onAddClick,
  onTextClick,
  onHeading1Click,
  onHeading2Click,
  onHeading3Click,
  onHeading4Click,
  onHeading5Click,
  onHeading6Click,
  voiceControl,
}: MenuBarProps) {
  return (
    <div className="border-b">
      <div className="container flex items-center space-x-2 py-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={onTextClick}>
              <Text className="mr-2 h-4 w-4" />
              Text
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onHeading1Click}>
              <Heading1 className="mr-2 h-4 w-4" />
              Heading 1
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onHeading2Click}>
              <Heading2 className="mr-2 h-4 w-4" />
              Heading 2
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onHeading3Click}>
              <Heading3 className="mr-2 h-4 w-4" />
              Heading 3
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onHeading4Click}>
              <Heading4 className="mr-2 h-4 w-4" />
              Heading 4
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onHeading5Click}>
              <Heading5 className="mr-2 h-4 w-4" />
              Heading 5
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onHeading6Click}>
              <Heading6 className="mr-2 h-4 w-4" />
              Heading 6
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" size="sm" onClick={onBoldClick}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onItalicClick}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onUnderlineClick}>
          <Underline className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="mx-2 h-5" />
        <Button variant="outline" size="sm" onClick={onAlignLeftClick}>
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onAlignCenterClick}>
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onAlignRightClick}>
          <AlignRight className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="mx-2 h-5" />
        <Button variant="outline" size="sm" onClick={onOrderedListClick}>
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onUnorderedListClick}>
          <ListUnordered className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onCodeClick}>
          <Code className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onImageClick}>
          <Image className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onLinkClick}>
          <Link className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onQuoteClick}>
          <Quote className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onSeparatorClick}>
          <SeparatorHorizontal className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="mx-2 h-5" />
        <Button variant="outline" size="sm" onClick={onUndoClick}>
          <Undo className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onRedoClick}>
          <Redo className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="mx-2 h-5" />
        <div className="ml-auto flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={onDownloadClick}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onCopyClick}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onTrashClick}>
            <Trash className="h-4 w-4" />
          </Button>
          <VoiceControlIndicator voiceControl={voiceControl!} className="ml-2" />
        </div>
      </div>
    </div>
  )
}
