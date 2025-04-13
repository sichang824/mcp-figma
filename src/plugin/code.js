// src/plugin/utils/colorUtils.ts
function hexToRgb(hex) {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  return { r, g, b };
}
function createSolidPaint(color) {
  if (typeof color === "string") {
    return { type: "SOLID", color: hexToRgb(color) };
  }
  return { type: "SOLID", color };
}

// src/plugin/utils/nodeUtils.ts
function applyCommonProperties(node, data) {
  if (data.x !== undefined)
    node.x = data.x;
  if (data.y !== undefined)
    node.y = data.y;
  if (data.name)
    node.name = data.name;
  if (data.opacity !== undefined && "opacity" in node) {
    node.opacity = data.opacity;
  }
  if (data.blendMode && "blendMode" in node) {
    node.blendMode = data.blendMode;
  }
  if (data.effects && "effects" in node) {
    node.effects = data.effects;
  }
  if (data.constraints && "constraints" in node) {
    node.constraints = data.constraints;
  }
  if (data.isMask !== undefined && "isMask" in node) {
    node.isMask = data.isMask;
  }
  if (data.visible !== undefined)
    node.visible = data.visible;
  if (data.locked !== undefined)
    node.locked = data.locked;
}
function selectAndFocusNodes(nodes) {
  const nodesToFocus = Array.isArray(nodes) ? nodes : [nodes];
  figma.currentPage.selection = nodesToFocus;
  figma.viewport.scrollAndZoomIntoView(nodesToFocus);
}
function buildResultObject(result) {
  let resultObject = {};
  if (!result)
    return resultObject;
  if (Array.isArray(result)) {
    resultObject.count = result.length;
    if (result.length > 0) {
      resultObject.items = result.map((node) => ({
        id: node.id,
        type: node.type,
        name: node.name
      }));
    }
  } else {
    const node = result;
    resultObject.id = node.id;
    resultObject.type = node.type;
    resultObject.name = node.name;
  }
  return resultObject;
}

// src/plugin/creators/shapeCreators.ts
function createRectangleFromData(data) {
  const rect = figma.createRectangle();
  rect.resize(data.width || 100, data.height || 100);
  if (data.fills) {
    rect.fills = data.fills;
  } else if (data.fill) {
    if (typeof data.fill === "string") {
      rect.fills = [createSolidPaint(data.fill)];
    } else {
      rect.fills = [data.fill];
    }
  }
  if (data.strokes)
    rect.strokes = data.strokes;
  if (data.strokeWeight !== undefined)
    rect.strokeWeight = data.strokeWeight;
  if (data.strokeAlign)
    rect.strokeAlign = data.strokeAlign;
  if (data.strokeCap)
    rect.strokeCap = data.strokeCap;
  if (data.strokeJoin)
    rect.strokeJoin = data.strokeJoin;
  if (data.dashPattern)
    rect.dashPattern = data.dashPattern;
  if (data.cornerRadius !== undefined)
    rect.cornerRadius = data.cornerRadius;
  if (data.topLeftRadius !== undefined)
    rect.topLeftRadius = data.topLeftRadius;
  if (data.topRightRadius !== undefined)
    rect.topRightRadius = data.topRightRadius;
  if (data.bottomLeftRadius !== undefined)
    rect.bottomLeftRadius = data.bottomLeftRadius;
  if (data.bottomRightRadius !== undefined)
    rect.bottomRightRadius = data.bottomRightRadius;
  return rect;
}
function createEllipseFromData(data) {
  const ellipse = figma.createEllipse();
  ellipse.resize(data.width || 100, data.height || 100);
  if (data.fills) {
    ellipse.fills = data.fills;
  } else if (data.fill) {
    if (typeof data.fill === "string") {
      ellipse.fills = [createSolidPaint(data.fill)];
    } else {
      ellipse.fills = [data.fill];
    }
  }
  if (data.arcData) {
    ellipse.arcData = {
      startingAngle: data.arcData.startingAngle !== undefined ? data.arcData.startingAngle : 0,
      endingAngle: data.arcData.endingAngle !== undefined ? data.arcData.endingAngle : 360,
      innerRadius: data.arcData.innerRadius !== undefined ? data.arcData.innerRadius : 0
    };
  }
  if (data.strokes)
    ellipse.strokes = data.strokes;
  if (data.strokeWeight !== undefined)
    ellipse.strokeWeight = data.strokeWeight;
  if (data.strokeAlign)
    ellipse.strokeAlign = data.strokeAlign;
  if (data.strokeCap)
    ellipse.strokeCap = data.strokeCap;
  if (data.strokeJoin)
    ellipse.strokeJoin = data.strokeJoin;
  if (data.dashPattern)
    ellipse.dashPattern = data.dashPattern;
  return ellipse;
}
function createPolygonFromData(data) {
  const polygon = figma.createPolygon();
  polygon.resize(data.width || 100, data.height || 100);
  if (data.pointCount)
    polygon.pointCount = data.pointCount;
  if (data.fills) {
    polygon.fills = data.fills;
  } else if (data.fill) {
    if (typeof data.fill === "string") {
      polygon.fills = [createSolidPaint(data.fill)];
    } else {
      polygon.fills = [data.fill];
    }
  } else if (data.color) {
    polygon.fills = [createSolidPaint(data.color)];
  }
  if (data.strokes)
    polygon.strokes = data.strokes;
  if (data.strokeWeight !== undefined)
    polygon.strokeWeight = data.strokeWeight;
  if (data.strokeAlign)
    polygon.strokeAlign = data.strokeAlign;
  if (data.strokeCap)
    polygon.strokeCap = data.strokeCap;
  if (data.strokeJoin)
    polygon.strokeJoin = data.strokeJoin;
  if (data.dashPattern)
    polygon.dashPattern = data.dashPattern;
  return polygon;
}
function createStarFromData(data) {
  const star = figma.createStar();
  star.resize(data.width || 100, data.height || 100);
  if (data.pointCount)
    star.pointCount = data.pointCount;
  if (data.innerRadius)
    star.innerRadius = data.innerRadius;
  if (data.fills) {
    star.fills = data.fills;
  } else if (data.fill) {
    if (typeof data.fill === "string") {
      star.fills = [createSolidPaint(data.fill)];
    } else {
      star.fills = [data.fill];
    }
  }
  return star;
}
function createLineFromData(data) {
  const line = figma.createLine();
  line.resize(data.width || 100, 0);
  if (data.rotation !== undefined)
    line.rotation = data.rotation;
  if (data.strokeWeight)
    line.strokeWeight = data.strokeWeight;
  if (data.strokeAlign)
    line.strokeAlign = data.strokeAlign;
  if (data.strokeCap)
    line.strokeCap = data.strokeCap;
  if (data.strokeJoin)
    line.strokeJoin = data.strokeJoin;
  if (data.dashPattern)
    line.dashPattern = data.dashPattern;
  if (data.strokes) {
    line.strokes = data.strokes;
  } else if (data.stroke) {
    if (typeof data.stroke === "string") {
      line.strokes = [createSolidPaint(data.stroke)];
    } else {
      line.strokes = [data.stroke];
    }
  } else if (data.color) {
    line.strokes = [createSolidPaint(data.color)];
  }
  return line;
}
function createVectorFromData(data) {
  const vector = figma.createVector();
  try {
    vector.resize(data.width || 100, data.height || 100);
    if (data.vectorNetwork) {
      vector.vectorNetwork = data.vectorNetwork;
    }
    if (data.vectorPaths) {
      vector.vectorPaths = data.vectorPaths;
    }
    if (data.handleMirroring) {
      vector.handleMirroring = data.handleMirroring;
    }
    if (data.fills) {
      vector.fills = data.fills;
    } else if (data.fill) {
      if (typeof data.fill === "string") {
        vector.fills = [createSolidPaint(data.fill)];
      } else {
        vector.fills = [data.fill];
      }
    } else if (data.color) {
      vector.fills = [createSolidPaint(data.color)];
    }
    if (data.strokes)
      vector.strokes = data.strokes;
    if (data.strokeWeight !== undefined)
      vector.strokeWeight = data.strokeWeight;
    if (data.strokeAlign)
      vector.strokeAlign = data.strokeAlign;
    if (data.strokeCap)
      vector.strokeCap = data.strokeCap;
    if (data.strokeJoin)
      vector.strokeJoin = data.strokeJoin;
    if (data.dashPattern)
      vector.dashPattern = data.dashPattern;
    if (data.strokeMiterLimit)
      vector.strokeMiterLimit = data.strokeMiterLimit;
    if (data.cornerRadius !== undefined)
      vector.cornerRadius = data.cornerRadius;
    if (data.cornerSmoothing !== undefined)
      vector.cornerSmoothing = data.cornerSmoothing;
    if (data.opacity !== undefined)
      vector.opacity = data.opacity;
    if (data.blendMode)
      vector.blendMode = data.blendMode;
    if (data.isMask !== undefined)
      vector.isMask = data.isMask;
    if (data.effects)
      vector.effects = data.effects;
    if (data.constraints)
      vector.constraints = data.constraints;
    if (data.layoutAlign)
      vector.layoutAlign = data.layoutAlign;
    if (data.layoutGrow !== undefined)
      vector.layoutGrow = data.layoutGrow;
    if (data.layoutPositioning)
      vector.layoutPositioning = data.layoutPositioning;
    if (data.rotation !== undefined)
      vector.rotation = data.rotation;
    if (data.layoutSizingHorizontal)
      vector.layoutSizingHorizontal = data.layoutSizingHorizontal;
    if (data.layoutSizingVertical)
      vector.layoutSizingVertical = data.layoutSizingVertical;
    console.log("Vector created successfully:", vector);
  } catch (error) {
    console.error("Error creating vector:", error);
  }
  return vector;
}

// src/plugin/creators/containerCreators.ts
function createFrameFromData(data) {
  const frame = figma.createFrame();
  frame.resize(data.width || 100, data.height || 100);
  if (data.fills) {
    frame.fills = data.fills;
  } else if (data.fill) {
    if (typeof data.fill === "string") {
      frame.fills = [createSolidPaint(data.fill)];
    } else {
      frame.fills = [data.fill];
    }
  }
  if (data.layoutMode)
    frame.layoutMode = data.layoutMode;
  if (data.primaryAxisSizingMode)
    frame.primaryAxisSizingMode = data.primaryAxisSizingMode;
  if (data.counterAxisSizingMode)
    frame.counterAxisSizingMode = data.counterAxisSizingMode;
  if (data.primaryAxisAlignItems)
    frame.primaryAxisAlignItems = data.primaryAxisAlignItems;
  if (data.counterAxisAlignItems)
    frame.counterAxisAlignItems = data.counterAxisAlignItems;
  if (data.paddingLeft !== undefined)
    frame.paddingLeft = data.paddingLeft;
  if (data.paddingRight !== undefined)
    frame.paddingRight = data.paddingRight;
  if (data.paddingTop !== undefined)
    frame.paddingTop = data.paddingTop;
  if (data.paddingBottom !== undefined)
    frame.paddingBottom = data.paddingBottom;
  if (data.itemSpacing !== undefined)
    frame.itemSpacing = data.itemSpacing;
  if (data.cornerRadius !== undefined)
    frame.cornerRadius = data.cornerRadius;
  if (data.topLeftRadius !== undefined)
    frame.topLeftRadius = data.topLeftRadius;
  if (data.topRightRadius !== undefined)
    frame.topRightRadius = data.topRightRadius;
  if (data.bottomLeftRadius !== undefined)
    frame.bottomLeftRadius = data.bottomLeftRadius;
  if (data.bottomRightRadius !== undefined)
    frame.bottomRightRadius = data.bottomRightRadius;
  return frame;
}
function createComponentFromData(data) {
  const component = figma.createComponent();
  component.resize(data.width || 100, data.height || 100);
  if (data.fills) {
    component.fills = data.fills;
  } else if (data.fill) {
    if (typeof data.fill === "string") {
      component.fills = [createSolidPaint(data.fill)];
    } else {
      component.fills = [data.fill];
    }
  }
  if (data.layoutMode)
    component.layoutMode = data.layoutMode;
  if (data.primaryAxisSizingMode)
    component.primaryAxisSizingMode = data.primaryAxisSizingMode;
  if (data.counterAxisSizingMode)
    component.counterAxisSizingMode = data.counterAxisSizingMode;
  if (data.primaryAxisAlignItems)
    component.primaryAxisAlignItems = data.primaryAxisAlignItems;
  if (data.counterAxisAlignItems)
    component.counterAxisAlignItems = data.counterAxisAlignItems;
  if (data.paddingLeft !== undefined)
    component.paddingLeft = data.paddingLeft;
  if (data.paddingRight !== undefined)
    component.paddingRight = data.paddingRight;
  if (data.paddingTop !== undefined)
    component.paddingTop = data.paddingTop;
  if (data.paddingBottom !== undefined)
    component.paddingBottom = data.paddingBottom;
  if (data.itemSpacing !== undefined)
    component.itemSpacing = data.itemSpacing;
  if (data.description)
    component.description = data.description;
  return component;
}
function createGroupFromData(data, children) {
  const group = figma.group(children, figma.currentPage);
  applyCommonProperties(group, data);
  return group;
}
function createInstanceFromData(data) {
  if (!data.componentId) {
    console.error("Cannot create instance: componentId is required");
    return null;
  }
  const component = figma.getNodeById(data.componentId);
  if (!component || component.type !== "COMPONENT") {
    console.error(`Cannot create instance: component with id ${data.componentId} not found`);
    return null;
  }
  const instance = component.createInstance();
  applyCommonProperties(instance, data);
  if (data.componentProperties) {
    for (const [key, value] of Object.entries(data.componentProperties)) {
      if (key in instance.componentProperties) {
        const prop = instance.componentProperties[key];
        if (prop.type === "BOOLEAN") {
          instance.setProperties({ [key]: !!value });
        } else if (prop.type === "TEXT") {
          instance.setProperties({ [key]: String(value) });
        } else if (prop.type === "INSTANCE_SWAP") {
          instance.setProperties({ [key]: String(value) });
        } else if (prop.type === "VARIANT") {
          instance.setProperties({ [key]: String(value) });
        }
      }
    }
  }
  return instance;
}
function createSectionFromData(data) {
  const section = figma.createSection();
  if (data.name)
    section.name = data.name;
  if (data.sectionContentsHidden !== undefined)
    section.sectionContentsHidden = data.sectionContentsHidden;
  if (data.x !== undefined)
    section.x = data.x;
  if (data.y !== undefined)
    section.y = data.y;
  return section;
}

// src/plugin/creators/textCreator.ts
async function createTextFromData(data) {
  const text = figma.createText();
  const fontFamily = data.fontFamily || data.fontName.family || "Inter";
  const fontStyle = data.fontStyle || data.fontName.style || "Regular";
  try {
    await figma.loadFontAsync({ family: fontFamily, style: fontStyle });
  } catch (error) {
    console.warn(`Failed to load font ${fontFamily} ${fontStyle}. Falling back to Inter Regular.`);
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  }
  text.characters = data.text || data.characters || "Text";
  if (data.x !== undefined)
    text.x = data.x;
  if (data.y !== undefined)
    text.y = data.y;
  if (data.fontSize)
    text.fontSize = data.fontSize;
  if (data.width)
    text.resize(data.width, text.height);
  if (data.fontName)
    text.fontName = data.fontName;
  if (data.textAlignHorizontal)
    text.textAlignHorizontal = data.textAlignHorizontal;
  if (data.textAlignVertical)
    text.textAlignVertical = data.textAlignVertical;
  if (data.textAutoResize)
    text.textAutoResize = data.textAutoResize;
  if (data.textTruncation)
    text.textTruncation = data.textTruncation;
  if (data.maxLines !== undefined)
    text.maxLines = data.maxLines;
  if (data.paragraphIndent)
    text.paragraphIndent = data.paragraphIndent;
  if (data.paragraphSpacing)
    text.paragraphSpacing = data.paragraphSpacing;
  if (data.listSpacing)
    text.listSpacing = data.listSpacing;
  if (data.hangingPunctuation !== undefined)
    text.hangingPunctuation = data.hangingPunctuation;
  if (data.hangingList !== undefined)
    text.hangingList = data.hangingList;
  if (data.autoRename !== undefined)
    text.autoRename = data.autoRename;
  if (data.letterSpacing)
    text.letterSpacing = data.letterSpacing;
  if (data.lineHeight)
    text.lineHeight = data.lineHeight;
  if (data.leadingTrim)
    text.leadingTrim = data.leadingTrim;
  if (data.textCase)
    text.textCase = data.textCase;
  if (data.textDecoration)
    text.textDecoration = data.textDecoration;
  if (data.textStyleId)
    text.textStyleId = data.textStyleId;
  if (data.textDecorationStyle)
    text.textDecorationStyle = data.textDecorationStyle;
  if (data.textDecorationOffset)
    text.textDecorationOffset = data.textDecorationOffset;
  if (data.textDecorationThickness)
    text.textDecorationThickness = data.textDecorationThickness;
  if (data.textDecorationColor)
    text.textDecorationColor = data.textDecorationColor;
  if (data.textDecorationSkipInk !== undefined)
    text.textDecorationSkipInk = data.textDecorationSkipInk;
  if (data.fills) {
    text.fills = data.fills;
  } else if (data.fill) {
    if (typeof data.fill === "string") {
      text.fills = [createSolidPaint(data.fill)];
    } else {
      text.fills = [data.fill];
    }
  }
  if (data.hyperlink) {
    text.hyperlink = data.hyperlink;
  }
  if (data.layoutAlign)
    text.layoutAlign = data.layoutAlign;
  if (data.layoutGrow !== undefined)
    text.layoutGrow = data.layoutGrow;
  if (data.layoutSizingHorizontal)
    text.layoutSizingHorizontal = data.layoutSizingHorizontal;
  if (data.layoutSizingVertical)
    text.layoutSizingVertical = data.layoutSizingVertical;
  if (data.rangeStyles && Array.isArray(data.rangeStyles)) {
    applyTextRangeStyles(text, data.rangeStyles);
  }
  if (data.name)
    text.name = data.name;
  if (data.visible !== undefined)
    text.visible = data.visible;
  if (data.locked !== undefined)
    text.locked = data.locked;
  if (data.opacity !== undefined)
    text.opacity = data.opacity;
  if (data.blendMode)
    text.blendMode = data.blendMode;
  if (data.effects)
    text.effects = data.effects;
  if (data.effectStyleId)
    text.effectStyleId = data.effectStyleId;
  if (data.exportSettings)
    text.exportSettings = data.exportSettings;
  if (data.constraints)
    text.constraints = data.constraints;
  return text;
}
function applyTextRangeStyles(textNode, ranges) {
  for (const range of ranges) {
    for (const [property, value] of Object.entries(range.style)) {
      if (property === "fills") {
        textNode.setRangeFills(range.start, range.end, value);
      } else if (property === "fillStyleId") {
        textNode.setRangeFillStyleId(range.start, range.end, value);
      } else if (property === "fontName") {
        textNode.setRangeFontName(range.start, range.end, value);
      } else if (property === "fontSize") {
        textNode.setRangeFontSize(range.start, range.end, value);
      } else if (property === "textCase") {
        textNode.setRangeTextCase(range.start, range.end, value);
      } else if (property === "textDecoration") {
        textNode.setRangeTextDecoration(range.start, range.end, value);
      } else if (property === "textDecorationStyle") {
        textNode.setRangeTextDecorationStyle(range.start, range.end, value);
      } else if (property === "textDecorationOffset") {
        textNode.setRangeTextDecorationOffset(range.start, range.end, value);
      } else if (property === "textDecorationThickness") {
        textNode.setRangeTextDecorationThickness(range.start, range.end, value);
      } else if (property === "textDecorationColor") {
        textNode.setRangeTextDecorationColor(range.start, range.end, value);
      } else if (property === "textDecorationSkipInk") {
        textNode.setRangeTextDecorationSkipInk(range.start, range.end, value);
      } else if (property === "letterSpacing") {
        textNode.setRangeLetterSpacing(range.start, range.end, value);
      } else if (property === "lineHeight") {
        textNode.setRangeLineHeight(range.start, range.end, value);
      } else if (property === "hyperlink") {
        textNode.setRangeHyperlink(range.start, range.end, value);
      } else if (property === "textStyleId") {
        textNode.setRangeTextStyleId(range.start, range.end, value);
      } else if (property === "indentation") {
        textNode.setRangeIndentation(range.start, range.end, value);
      } else if (property === "paragraphIndent") {
        textNode.setRangeParagraphIndent(range.start, range.end, value);
      } else if (property === "paragraphSpacing") {
        textNode.setRangeParagraphSpacing(range.start, range.end, value);
      } else if (property === "listOptions") {
        textNode.setRangeListOptions(range.start, range.end, value);
      } else if (property === "listSpacing") {
        textNode.setRangeListSpacing(range.start, range.end, value);
      }
    }
  }
}

// src/plugin/creators/specialCreators.ts
function createBooleanOperationFromData(data) {
  if (!data.children || !Array.isArray(data.children) || data.children.length < 2) {
    console.error("Boolean operation requires at least 2 child nodes");
    return null;
  }
  let childNodes = [];
  try {
    for (const childData of data.children) {
      const node = figma.createRectangle();
      childNodes.push(node);
    }
    const booleanOperation = figma.createBooleanOperation();
    if (data.booleanOperation) {
      booleanOperation.booleanOperation = data.booleanOperation;
    }
    applyCommonProperties(booleanOperation, data);
    return booleanOperation;
  } catch (error) {
    console.error("Failed to create boolean operation:", error);
    childNodes.forEach((node) => node.remove());
    return null;
  }
}
function createConnectorFromData(data) {
  const connector = figma.createConnector();
  if (data.connectorStart)
    connector.connectorStart = data.connectorStart;
  if (data.connectorEnd)
    connector.connectorEnd = data.connectorEnd;
  if (data.connectorStartStrokeCap)
    connector.connectorStartStrokeCap = data.connectorStartStrokeCap;
  if (data.connectorEndStrokeCap)
    connector.connectorEndStrokeCap = data.connectorEndStrokeCap;
  if (data.connectorLineType)
    connector.connectorLineType = data.connectorLineType;
  if (data.strokes)
    connector.strokes = data.strokes;
  if (data.strokeWeight)
    connector.strokeWeight = data.strokeWeight;
  applyCommonProperties(connector, data);
  return connector;
}
function createShapeWithTextFromData(data) {
  if (!("createShapeWithText" in figma)) {
    console.error("ShapeWithText creation is not supported in this Figma version");
    return null;
  }
  try {
    const shapeWithText = figma.createShapeWithText();
    if (data.shapeType)
      shapeWithText.shapeType = data.shapeType;
    if (data.text || data.characters) {
      shapeWithText.text.characters = data.text || data.characters;
    }
    try {
      if (data.fontSize)
        shapeWithText.text.fontSize = data.fontSize;
      if (data.fontName)
        shapeWithText.text.fontName = data.fontName;
      if (data.textAlignHorizontal && "textAlignHorizontal" in shapeWithText.text) {
        shapeWithText.text.textAlignHorizontal = data.textAlignHorizontal;
      }
      if (data.textAlignVertical && "textAlignVertical" in shapeWithText.text) {
        shapeWithText.text.textAlignVertical = data.textAlignVertical;
      }
    } catch (e) {
      console.warn("Some text properties could not be set on ShapeWithText:", e);
    }
    if (data.fills)
      shapeWithText.fills = data.fills;
    if (data.strokes)
      shapeWithText.strokes = data.strokes;
    applyCommonProperties(shapeWithText, data);
    return shapeWithText;
  } catch (error) {
    console.error("Failed to create shape with text:", error);
    return null;
  }
}
function createCodeBlockFromData(data) {
  const codeBlock = figma.createCodeBlock();
  if (data.code)
    codeBlock.code = data.code;
  if (data.codeLanguage)
    codeBlock.codeLanguage = data.codeLanguage;
  applyCommonProperties(codeBlock, data);
  return codeBlock;
}
function createTableFromData(data) {
  const table = figma.createTable(data.numRows || 2, data.numColumns || 2);
  if (data.fills && "fills" in table) {
    table.fills = data.fills;
  }
  if (data.cells && Array.isArray(data.cells)) {
    for (const cellData of data.cells) {
      if (cellData.rowIndex !== undefined && cellData.columnIndex !== undefined) {
        try {
          let cell;
          if ("cellAt" in table) {
            cell = table.cellAt(cellData.rowIndex, cellData.columnIndex);
          } else if ("getCellAt" in table) {
            cell = table.getCellAt(cellData.rowIndex, cellData.columnIndex);
          }
          if (cell) {
            if (cellData.text && cell.text)
              cell.text.characters = cellData.text;
            if (cellData.fills && "fills" in cell)
              cell.fills = cellData.fills;
            if (cellData.rowSpan && "rowSpan" in cell)
              cell.rowSpan = cellData.rowSpan;
            if (cellData.columnSpan && "columnSpan" in cell)
              cell.columnSpan = cellData.columnSpan;
          }
        } catch (e) {
          console.warn(`Could not set properties for cell at ${cellData.rowIndex}, ${cellData.columnIndex}:`, e);
        }
      }
    }
  }
  applyCommonProperties(table, data);
  return table;
}
function createWidgetFromData(data) {
  if (!("createWidget" in figma)) {
    console.error("Widget creation is not supported in this Figma version");
    return null;
  }
  if (!data.widgetId) {
    console.error("Widget creation requires a widgetId");
    return null;
  }
  try {
    const widget = figma.createWidget(data.widgetId);
    if (data.widgetData)
      widget.widgetData = JSON.stringify(data.widgetData);
    if (data.width && data.height && "resize" in widget)
      widget.resize(data.width, data.height);
    applyCommonProperties(widget, data);
    return widget;
  } catch (error) {
    console.error("Failed to create widget:", error);
    return null;
  }
}
function createMediaFromData(data) {
  if (!("createMedia" in figma)) {
    console.error("Media creation is not supported in this Figma version");
    return null;
  }
  if (!data.hash) {
    console.error("Media creation requires a valid media hash");
    return null;
  }
  try {
    const media = figma.createMedia(data.hash);
    applyCommonProperties(media, data);
    return media;
  } catch (error) {
    console.error("Failed to create media:", error);
    return null;
  }
}

// src/plugin/creators/imageCreators.ts
function createImageFromData(data) {
  try {
    if (!data.hash) {
      console.error("Image creation requires an image hash");
      return null;
    }
    const image = figma.createImage(data.hash);
    const rect = figma.createRectangle();
    if (data.width && data.height) {
      rect.resize(data.width, data.height);
    }
    rect.fills = [{
      type: "IMAGE",
      scaleMode: data.scaleMode || "FILL",
      imageHash: image.hash
    }];
    applyCommonProperties(rect, data);
    return rect;
  } catch (error) {
    console.error("Failed to create image:", error);
    return null;
  }
}
async function createImageFromBytesAsync(data) {
  try {
    if (!data.bytes && !data.file) {
      console.error("Image creation requires image bytes or file");
      return null;
    }
    let image;
    if (data.bytes) {
      image = await figma.createImageAsync(data.bytes);
    } else if (data.file) {
      image = await figma.createImageAsync(data.file);
    } else {
      return null;
    }
    const rect = figma.createRectangle();
    if (data.width && data.height) {
      rect.resize(data.width, data.height);
    }
    rect.fills = [{
      type: "IMAGE",
      scaleMode: data.scaleMode || "FILL",
      imageHash: image.hash
    }];
    applyCommonProperties(rect, data);
    return rect;
  } catch (error) {
    console.error("Failed to create image asynchronously:", error);
    return null;
  }
}
function createGifFromData(data) {
  console.error("createGif API is not directly available or implemented");
  return null;
}
async function createVideoFromDataAsync(data) {
  if (!("createVideoAsync" in figma)) {
    console.error("Video creation is not supported in this Figma version");
    return null;
  }
  try {
    if (!data.bytes) {
      console.error("Video creation requires video bytes");
      return null;
    }
    const video = await figma.createVideoAsync(data.bytes);
    applyCommonProperties(video, data);
    return video;
  } catch (error) {
    console.error("Failed to create video:", error);
    return null;
  }
}
async function createLinkPreviewFromDataAsync(data) {
  if (!("createLinkPreviewAsync" in figma)) {
    console.error("Link preview creation is not supported in this Figma version");
    return null;
  }
  try {
    if (!data.url) {
      console.error("Link preview creation requires a URL");
      return null;
    }
    const linkPreview = await figma.createLinkPreviewAsync(data.url);
    applyCommonProperties(linkPreview, data);
    return linkPreview;
  } catch (error) {
    console.error("Failed to create link preview:", error);
    return null;
  }
}

// src/plugin/creators/sliceCreators.ts
function createSliceFromData(data) {
  const slice = figma.createSlice();
  if (data.width && data.height) {
    slice.resize(data.width, data.height);
  }
  if (data.x !== undefined)
    slice.x = data.x;
  if (data.y !== undefined)
    slice.y = data.y;
  if (data.exportSettings && Array.isArray(data.exportSettings)) {
    slice.exportSettings = data.exportSettings;
  }
  if (data.name)
    slice.name = data.name;
  if (data.visible !== undefined)
    slice.visible = data.visible;
  return slice;
}
function createPageFromData(data) {
  const page = figma.createPage();
  if (data.name)
    page.name = data.name;
  if (data.backgrounds)
    page.backgrounds = data.backgrounds;
  return page;
}
function createPageDividerFromData(data) {
  if (!("createPageDivider" in figma)) {
    console.error("createPageDivider is not supported in this Figma version");
    return null;
  }
  try {
    const pageDivider = figma.createPageDivider();
    if (data.name)
      pageDivider.name = data.name;
    return pageDivider;
  } catch (error) {
    console.error("Failed to create page divider:", error);
    return null;
  }
}
function createSlideFromData(data) {
  if (!("createSlide" in figma)) {
    console.error("createSlide is not supported in this Figma version");
    return null;
  }
  try {
    const slide = figma.createSlide();
    if (data.name)
      slide.name = data.name;
    applyCommonProperties(slide, data);
    return slide;
  } catch (error) {
    console.error("Failed to create slide:", error);
    return null;
  }
}
function createSlideRowFromData(data) {
  if (!("createSlideRow" in figma)) {
    console.error("createSlideRow is not supported in this Figma version");
    return null;
  }
  try {
    const slideRow = figma.createSlideRow();
    if (data.name)
      slideRow.name = data.name;
    applyCommonProperties(slideRow, data);
    return slideRow;
  } catch (error) {
    console.error("Failed to create slide row:", error);
    return null;
  }
}

// src/plugin/creators/componentCreators.ts
function createComponentFromNodeData(data) {
  if (!data.sourceNode) {
    console.error("createComponentFromNode requires a sourceNode");
    return null;
  }
  try {
    let sourceNode;
    if (typeof data.sourceNode === "string") {
      sourceNode = figma.getNodeById(data.sourceNode);
      if (!sourceNode || !("type" in sourceNode)) {
        console.error(`Node with ID ${data.sourceNode} not found or is not a valid node`);
        return null;
      }
    } else {
      sourceNode = data.sourceNode;
    }
    const component = figma.createComponentFromNode(sourceNode);
    if (data.description)
      component.description = data.description;
    applyCommonProperties(component, data);
    return component;
  } catch (error) {
    console.error("Failed to create component from node:", error);
    return null;
  }
}
function createComponentSetFromData(data) {
  try {
    if (!data.components || !Array.isArray(data.components) || data.components.length === 0) {
      console.error("Component set creation requires component nodes");
      return null;
    }
    const componentNodes = [];
    for (const component of data.components) {
      let node;
      if (typeof component === "string") {
        node = figma.getNodeById(component);
      } else {
        node = component;
      }
      if (node && node.type === "COMPONENT") {
        componentNodes.push(node);
      }
    }
    if (componentNodes.length === 0) {
      console.error("No valid component nodes provided");
      return null;
    }
    const componentSet = figma.combineAsVariants(componentNodes, figma.currentPage);
    if (data.name)
      componentSet.name = data.name;
    applyCommonProperties(componentSet, data);
    return componentSet;
  } catch (error) {
    console.error("Failed to create component set:", error);
    return null;
  }
}

// src/plugin/creators/elementCreator.ts
async function createElementFromData(data) {
  if (!data || !data.type) {
    console.error("Invalid element data: missing type");
    return null;
  }
  let element = null;
  try {
    switch (data.type.toLowerCase()) {
      case "rectangle":
        element = createRectangleFromData(data);
        break;
      case "ellipse":
      case "circle":
        element = createEllipseFromData(data);
        break;
      case "polygon":
        element = createPolygonFromData(data);
        break;
      case "star":
        element = createStarFromData(data);
        break;
      case "line":
        element = createLineFromData(data);
        break;
      case "vector":
        element = createVectorFromData(data);
        break;
      case "frame":
        element = createFrameFromData(data);
        break;
      case "component":
        element = createComponentFromData(data);
        break;
      case "componentfromnode":
        element = createComponentFromNodeData(data);
        break;
      case "componentset":
        element = createComponentSetFromData(data);
        break;
      case "instance":
        element = createInstanceFromData(data);
        break;
      case "section":
        element = createSectionFromData(data);
        break;
      case "text":
        element = await createTextFromData(data);
        break;
      case "boolean":
      case "booleanoperation":
        element = createBooleanOperationFromData(data);
        break;
      case "connector":
        element = createConnectorFromData(data);
        break;
      case "shapewithtext":
        element = createShapeWithTextFromData(data);
        break;
      case "codeblock":
        element = createCodeBlockFromData(data);
        break;
      case "table":
        element = createTableFromData(data);
        break;
      case "widget":
        element = createWidgetFromData(data);
        break;
      case "media":
        element = createMediaFromData(data);
        break;
      case "image":
        if (data.bytes || data.file) {
          element = await createImageFromBytesAsync(data);
        } else {
          element = createImageFromData(data);
        }
        break;
      case "gif":
        element = createGifFromData(data);
        break;
      case "video":
        element = await createVideoFromDataAsync(data);
        break;
      case "linkpreview":
        element = await createLinkPreviewFromDataAsync(data);
        break;
      case "slice":
        element = createSliceFromData(data);
        break;
      case "page":
        const page = createPageFromData(data);
        console.log(`Created page: ${page.name}`);
        return null;
      case "pagedivider":
        element = createPageDividerFromData(data);
        break;
      case "slide":
        element = createSlideFromData(data);
        break;
      case "sliderow":
        element = createSlideRowFromData(data);
        break;
      case "group":
        if (!data.children || !Array.isArray(data.children) || data.children.length < 1) {
          console.error("Cannot create group: children array is required");
          return null;
        }
        const childNodes = [];
        for (const childData of data.children) {
          const child = await createElementFromData(childData);
          if (child)
            childNodes.push(child);
        }
        if (childNodes.length > 0) {
          element = createGroupFromData(data, childNodes);
        } else {
          console.error("Cannot create group: no valid children were created");
          return null;
        }
        break;
      default:
        console.error(`Unsupported element type: ${data.type}`);
        return null;
    }
    if (element) {
      applyCommonProperties(element, data);
      if (data.select !== false) {
        selectAndFocusNodes(element);
      }
    }
    return element;
  } catch (error) {
    console.error(`Error creating element: ${error instanceof Error ? error.message : "Unknown error"}`);
    return null;
  }
}
async function createElementsFromDataArray(dataArray) {
  const createdNodes = [];
  for (const data of dataArray) {
    const node = await createElementFromData(data);
    if (node)
      createdNodes.push(node);
  }
  if (createdNodes.length > 0) {
    selectAndFocusNodes(createdNodes);
  }
  return createdNodes;
}

// src/plugin/code.ts
figma.showUI(__html__, { width: 320, height: 500 });
console.log("Figma MCP Plugin loaded");
var elementCreators = {
  "create-rectangle": createRectangleFromData,
  "create-circle": createEllipseFromData,
  "create-ellipse": createEllipseFromData,
  "create-polygon": createPolygonFromData,
  "create-line": createLineFromData,
  "create-text": createTextFromData,
  "create-star": createStarFromData,
  "create-vector": createVectorFromData,
  "create-arc": (params) => {
    const ellipse = createEllipseFromData(params);
    if (params.arcData || params.startAngle !== undefined && params.endAngle !== undefined) {
      ellipse.arcData = {
        startingAngle: params.startAngle || params.arcData.startingAngle || 0,
        endingAngle: params.endAngle || params.arcData.endingAngle || 360,
        innerRadius: params.innerRadius || params.arcData.innerRadius || 0
      };
    }
    return ellipse;
  }
};
async function createElement(type, params) {
  console.log(`Creating ${type} with params:`, params);
  const creator = elementCreators[type];
  if (!creator) {
    console.error(`Unknown element type: ${type}`);
    return null;
  }
  try {
    const element = await Promise.resolve(creator(params));
    if (element && params) {
      if (params.x !== undefined)
        element.x = params.x;
      if (params.y !== undefined)
        element.y = params.y;
    }
    if (element) {
      selectAndFocusNodes(element);
    }
    return element;
  } catch (error) {
    console.error(`Error creating ${type}:`, error);
    return null;
  }
}
figma.ui.onmessage = async function(msg) {
  console.log("Received message from UI:", msg);
  if (elementCreators[msg.type]) {
    await createElement(msg.type, msg);
  } else if (msg.type === "create-element") {
    console.log("Creating element with data:", msg.data);
    createElementFromData(msg.data);
  } else if (msg.type === "create-elements") {
    console.log("Creating multiple elements with data:", msg.data);
    createElementsFromDataArray(msg.data);
  } else if (msg.type === "mcp-command") {
    console.log("Received MCP command:", msg.command, "with params:", msg.params);
    handleMcpCommand(msg.command, msg.params);
  } else if (msg.type === "cancel") {
    console.log("Closing plugin");
    figma.closePlugin();
  } else {
    console.log("Unknown message type:", msg.type);
  }
};
async function handleMcpCommand(command, params) {
  let result = null;
  try {
    const pluginCommand = command.replace(/_/g, "-");
    switch (pluginCommand) {
      case "create-rectangle":
      case "create-circle":
      case "create-polygon":
      case "create-line":
      case "create-arc":
      case "create-vector":
        console.log(`MCP command: Creating ${pluginCommand.substring(7)} with params:`, params);
        result = await createElement(pluginCommand, params);
        break;
      case "create-text":
        console.log("MCP command: Creating text with params:", params);
        result = await createElement(pluginCommand, params);
        break;
      case "create-element":
        console.log("MCP command: Creating element with params:", params);
        result = await createElementFromData(params);
        break;
      case "create-elements":
        console.log("MCP command: Creating multiple elements with params:", params);
        result = await createElementsFromDataArray(params);
        break;
      case "get-selection":
        console.log("MCP command: Getting current selection");
        result = figma.currentPage.selection;
        break;
      case "get-elements":
        console.log("MCP command: Getting elements with params:", params);
        const page = params.page_id ? figma.getNodeById(params.page_id) : figma.currentPage;
        if (!page || page.type !== "PAGE") {
          throw new Error("Invalid page ID or node is not a page");
        }
        const nodeType = params.type || "ALL";
        const limit = params.limit || 100;
        const includeHidden = params.include_hidden || false;
        if (nodeType === "ALL") {
          result = includeHidden ? page.children.slice(0, limit) : page.children.filter((node2) => node2.visible).slice(0, limit);
        } else {
          result = page.findAll((node2) => {
            const typeMatch = node2.type === nodeType;
            const visibilityMatch = includeHidden || node2.visible;
            return typeMatch && visibilityMatch;
          }).slice(0, limit);
        }
        break;
      case "get-element":
        console.log("MCP command: Getting element with ID:", params.node_id);
        const node = figma.getNodeById(params.node_id);
        if (!node) {
          throw new Error("Element not found with ID: " + params.node_id);
        }
        if (!["DOCUMENT", "PAGE"].includes(node.type)) {
          if (params.include_children && "children" in node) {
            result = [node, ...node.children || []];
          } else {
            result = node;
          }
        } else if (node.type === "PAGE") {
          result = node;
        } else {
          throw new Error("Unsupported node type: " + node.type);
        }
        break;
      case "get-pages":
        console.log("MCP command: Getting all pages");
        result = figma.root.children;
        break;
      case "get-page":
        console.log("MCP command: Getting page with ID:", params.page_id);
        if (!params.page_id) {
          console.log("No page_id provided, using current page");
          result = figma.currentPage;
        } else {
          const pageNode = figma.getNodeById(params.page_id);
          if (!pageNode || pageNode.type !== "PAGE")
            throw new Error("Invalid page ID or node is not a page");
          result = pageNode;
        }
        break;
      case "create-page":
        console.log("MCP command: Creating new page with name:", params.name);
        const newPage = figma.createPage();
        newPage.name = params.name || "New Page";
        result = newPage;
        break;
      case "switch-page":
        console.log("MCP command: Switching to page with ID:", params.id);
        if (!params.id)
          throw new Error("Page ID is required");
        const switchPageNode = figma.getNodeById(params.id);
        if (!switchPageNode || switchPageNode.type !== "PAGE")
          throw new Error("Invalid page ID");
        figma.currentPage = switchPageNode;
        result = switchPageNode;
        break;
      case "modify-rectangle":
        console.log("MCP command: Modifying rectangle with ID:", params.id);
        if (!params.id)
          throw new Error("Rectangle ID is required");
        const modifyNode = figma.getNodeById(params.id);
        if (!modifyNode || modifyNode.type !== "RECTANGLE")
          throw new Error("Invalid rectangle ID");
        const rect = modifyNode;
        if (params.x !== undefined)
          rect.x = params.x;
        if (params.y !== undefined)
          rect.y = params.y;
        if (params.width !== undefined && params.height !== undefined)
          rect.resize(params.width, params.height);
        if (params.cornerRadius !== undefined)
          rect.cornerRadius = params.cornerRadius;
        if (params.color)
          rect.fills = [{ type: "SOLID", color: hexToRgb(params.color) }];
        result = rect;
        break;
      default:
        console.log("Unknown MCP command:", command);
        throw new Error("Unknown command: " + command);
    }
    let resultForBuilder = null;
    if (result === null) {
      resultForBuilder = null;
    } else if (Array.isArray(result)) {
      resultForBuilder = result;
    } else if ("type" in result && result.type === "PAGE") {
      resultForBuilder = result;
    } else {
      resultForBuilder = result;
    }
    const resultObject = buildResultObject(resultForBuilder);
    console.log("Command result:", resultObject);
    figma.ui.postMessage({
      type: "mcp-response",
      success: true,
      command,
      result: resultObject
    });
    console.log("Response sent to UI");
    return resultObject;
  } catch (error) {
    console.error("Error handling MCP command:", error);
    figma.ui.postMessage({
      type: "mcp-response",
      success: false,
      command,
      error: error instanceof Error ? error.message : "Unknown error"
    });
    console.log("Error response sent to UI");
    throw error;
  }
}
