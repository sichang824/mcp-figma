// Basic Figma Widget Template

const { widget } = figma;
const { AutoLayout, Text, useSyncedState, usePropertyMenu, Rectangle } = widget;

function MCPWidget() {
  // Example synced state
  const [count, setCount] = useSyncedState("count", 0);
  
  // Example property menu setup
  usePropertyMenu([
    {
      itemType: "action",
      tooltip: "Increment",
      propertyName: "increment",
    },
    {
      itemType: "action",
      tooltip: "Reset",
      propertyName: "reset",
    },
  ], ({ propertyName }) => {
    if (propertyName === "increment") {
      setCount(count + 1);
    } else if (propertyName === "reset") {
      setCount(0);
    }
  });

  return (
    <AutoLayout
      direction="vertical"
      spacing={16}
      padding={24}
      cornerRadius={8}
      fill="#FFFFFF"
      stroke="#E6E6E6"
      strokeWidth={1}
      effect={{
        type: "drop-shadow",
        color: { r: 0, g: 0, b: 0, a: 0.1 },
        offset: { x: 0, y: 2 },
        blur: 4,
      }}
    >
      <Text fontSize={24} fontWeight={700}>MCP Figma Widget</Text>
      <Text fontSize={16}>Count: {count}</Text>
      <AutoLayout direction="horizontal" spacing={8}>
        <Rectangle
          onClick={() => setCount(count + 1)}
          fill="#0D99FF"
          cornerRadius={4}
          padding={{ vertical: 8, horizontal: 16 }}
          hoverStyle={{ fill: "#0870B8" }}
        >
          <Text fontSize={14} fill="#FFFFFF">Increment</Text>
        </Rectangle>
        <Rectangle
          onClick={() => setCount(0)}
          fill="#F0F0F0"
          cornerRadius={4}
          padding={{ vertical: 8, horizontal: 16 }}
          hoverStyle={{ fill: "#E0E0E0" }}
        >
          <Text fontSize={14}>Reset</Text>
        </Rectangle>
      </AutoLayout>
    </AutoLayout>
  );
}

// Register the widget
widget.register(MCPWidget);
