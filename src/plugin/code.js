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
function createRectangle(x, y, width, height, color) {
  const rect = createRectangleFromData({
    width,
    height,
    fill: color
  });
  rect.x = x;
  rect.y = y;
  selectAndFocusNodes(rect);
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
function createCircle(x, y, width, height, color) {
  const ellipse = createEllipseFromData({
    width,
    height,
    fill: color
  });
  ellipse.x = x;
  ellipse.y = y;
  selectAndFocusNodes(ellipse);
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
  }
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
  if (data.strokeWeight)
    line.strokeWeight = data.strokeWeight;
  if (data.strokes) {
    line.strokes = data.strokes;
  } else if (data.stroke) {
    if (typeof data.stroke === "string") {
      line.strokes = [createSolidPaint(data.stroke)];
    } else {
      line.strokes = [data.stroke];
    }
  }
  return line;
}
function createVectorFromData(data) {
  const vector = figma.createVector();
  vector.resize(data.width || 100, data.height || 100);
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
  const fontFamily = data.fontFamily || "Inter";
  const fontStyle = data.fontStyle || "Regular";
  try {
    await figma.loadFontAsync({ family: fontFamily, style: fontStyle });
  } catch (error) {
    console.warn(`Failed to load font ${fontFamily} ${fontStyle}. Falling back to Inter Regular.`);
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  }
  text.characters = data.text || data.characters || "Text";
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
  if (data.paragraphIndent)
    text.paragraphIndent = data.paragraphIndent;
  if (data.paragraphSpacing)
    text.paragraphSpacing = data.paragraphSpacing;
  if (data.letterSpacing)
    text.letterSpacing = data.letterSpacing;
  if (data.lineHeight)
    text.lineHeight = data.lineHeight;
  if (data.textCase)
    text.textCase = data.textCase;
  if (data.textDecoration)
    text.textDecoration = data.textDecoration;
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
  return text;
}
async function createText(x, y, content, fontSize) {
  const text = await createTextFromData({
    text: content,
    fontSize
  });
  text.x = x;
  text.y = y;
  selectAndFocusNodes(text);
  return text;
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
figma.showUI(__html__, { width: 300, height: 450 });
figma.ui.onmessage = function(msg) {
  if (msg.type === "create-rectangle") {
    createRectangle(msg.x || 100, msg.y || 100, msg.width || 150, msg.height || 150, msg.color || "#ff0000");
  } else if (msg.type === "create-circle") {
    createCircle(msg.x || 100, msg.y || 100, msg.width || 150, msg.height || 150, msg.color || "#0000ff");
  } else if (msg.type === "create-text") {
    createText(msg.x || 100, msg.y || 100, msg.text || "Hello Figma!", msg.fontSize || 24);
  } else if (msg.type === "create-element") {
    createElementFromData(msg.data);
  } else if (msg.type === "create-elements") {
    createElementsFromDataArray(msg.data);
  } else if (msg.type === "mcp-command") {
    handleMcpCommand(msg.command, msg.params);
  } else if (msg.type === "cancel") {
    figma.closePlugin();
  }
};
async function handleMcpCommand(command, params) {
  let result = null;
  try {
    switch (command) {
      case "create-rectangle":
        result = createRectangle(params.x || 100, params.y || 100, params.width || 150, params.height || 150, params.color || "#ff0000");
        break;
      case "create-circle":
        result = createCircle(params.x || 100, params.y || 100, params.width || 150, params.height || 150, params.color || "#0000ff");
        break;
      case "create-text":
        result = await createText(params.x || 100, params.y || 100, params.text || "Hello from MCP!", params.fontSize || 24);
        break;
      case "create-element":
        result = await createElementFromData(params);
        break;
      case "create-elements":
        result = await createElementsFromDataArray(params);
        break;
      case "get-selection":
        result = figma.currentPage.selection;
        break;
      case "modify-rectangle":
        if (!params.id)
          throw new Error("Rectangle ID is required");
        const node = figma.getNodeById(params.id);
        if (!node || node.type !== "RECTANGLE")
          throw new Error("Invalid rectangle ID");
        const rect = node;
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
        throw new Error("Unknown command: " + command);
    }
    const resultObject = buildResultObject(result);
    figma.ui.postMessage({
      type: "mcp-response",
      success: true,
      command,
      result: resultObject
    });
  } catch (error) {
    figma.ui.postMessage({
      type: "mcp-response",
      success: false,
      command,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
