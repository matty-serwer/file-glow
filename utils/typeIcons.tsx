import React from "react";
import { ReactNode } from "react";
import { Doc } from "../convex/_generated/dataModel";
import { ImageIcon, FileIcon, VideoIcon, FileTextIcon, ImagePlusIcon } from "lucide-react";

const ICON_SIZE = 24;
const ICON_STYLE = { marginLeft: '-4px' };
const STROKE_WIDTH = 2;

export const typeIcons: Record<Doc<"files">["type"], ReactNode> = {
  image: <ImageIcon size={ICON_SIZE} style={ICON_STYLE} strokeWidth={STROKE_WIDTH} />,
  pdf: <ImagePlusIcon size={ICON_SIZE} style={ICON_STYLE} strokeWidth={STROKE_WIDTH} />,
  video: <VideoIcon size={ICON_SIZE} style={ICON_STYLE} strokeWidth={STROKE_WIDTH} />,
  document: <FileTextIcon size={ICON_SIZE} style={ICON_STYLE} strokeWidth={STROKE_WIDTH} />,
  csv: <FileIcon size={ICON_SIZE} style={ICON_STYLE} strokeWidth={STROKE_WIDTH} />,
};
