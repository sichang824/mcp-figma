# Figma Widget Tools Guide

This guide explains how to use the MCP server's Widget Tools for interacting with Figma widgets.

## Overview

Widget Tools are a set of utilities that allow AI assistants to interact with and manipulate Figma widgets through the MCP protocol. These tools provide capabilities for discovering, analyzing, and working with widgets in Figma files.

## Available Widget Tools

### 1. get_widgets

Retrieves all widget nodes from a Figma file.

**Parameters:**
- `file_key` (string): The Figma file key to retrieve widgets from

**Example:**
```json
{
  "file_key": "abcxyz123456"
}
```

**Response:**
Returns a list of all widgets in the file, including their names, IDs, and whether they have sync data.

### 2. get_widget

Retrieves detailed information about a specific widget node.

**Parameters:**
- `file_key` (string): The Figma file key
- `node_id` (string): The ID of the widget node

**Example:**
```json
{
  "file_key": "abcxyz123456",
  "node_id": "1:123"
}
```

**Response:**
Returns detailed information about the specified widget, including its sync data if available.

### 3. get_widget_sync_data

Retrieves the synchronized state data for a specific widget.

**Parameters:**
- `file_key` (string): The Figma file key
- `node_id` (string): The ID of the widget node

**Example:**
```json
{
  "file_key": "abcxyz123456",
  "node_id": "1:123"
}
```

**Response:**
Returns the raw sync data (state) for the specified widget in JSON format.

### 4. search_widgets

Searches for widgets that have specific sync data properties and values.

**Parameters:**
- `file_key` (string): The Figma file key
- `property_key` (string): The sync data property key to search for
- `property_value` (string, optional): Optional property value to match

**Example:**
```json
{
  "file_key": "abcxyz123456",
  "property_key": "count",
  "property_value": "5"
}
```

**Response:**
Returns a list of widgets that match the search criteria.

### 5. analyze_widget_structure

Provides a detailed analysis of a widget's structure and properties.

**Parameters:**
- `file_key` (string): The Figma file key
- `node_id` (string): The ID of the widget node

**Example:**
```json
{
  "file_key": "abcxyz123456",
  "node_id": "1:123"
}
```

**Response:**
Returns a comprehensive analysis of the widget's structure, including basic information, placement details, and sync data.

## Widget Integration

These tools can be used to:

1. Discover widgets in Figma files
2. Analyze widget properties and state
3. Search for widgets with specific characteristics
4. Extract widget sync data for external processing
5. Generate reports about widget usage in design files

## Implementation Details

The widget tools use the Figma API to access widget data and analyze their properties. They are designed to work seamlessly with the MCP protocol and provide rich, structured information about widgets that can be used by AI assistants.

## Future Enhancements

Planned enhancements for widget tools include:

- Widget state modification capabilities (requires special access)
- Widget creation and deletion
- Widget template libraries
- Widget analytics and usage statistics
