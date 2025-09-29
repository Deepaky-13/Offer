import Warehouse from "../models/Warehouse.js";

// 📌 Create a new warehouse
export const createWarehouse = async (req, res) => {
  const { name, location } = req.body;

  const existing = await Warehouse.findOne({ name });
  if (existing) {
    return res
      .status(400)
      .json({ msg: "Warehouse with this name already exists" });
  }

  const warehouse = await Warehouse.create({ name, location, bins: [] });
  res.status(201).json({ msg: "Warehouse created successfully", warehouse });
};

// 📌 Get all warehouses
export const getAllWarehouses = async (req, res) => {
  const warehouses = await Warehouse.find();
  res.status(200).json(warehouses);
};

// 📌 Get single warehouse by ID
export const getWarehouseById = async (req, res) => {
  const { id } = req.params;
  const warehouse = await Warehouse.findById(id);

  if (!warehouse) {
    return res.status(404).json({ msg: "Warehouse not found" });
  }

  res.status(200).json(warehouse);
};

// 📌 Add a new bin to warehouse
export const addBinToWarehouse = async (req, res) => {
  const { id } = req.params; // warehouse id
  const { binName, capacity } = req.body;

  const warehouse = await Warehouse.findById(id);
  if (!warehouse) {
    return res.status(404).json({ msg: "Warehouse not found" });
  }

  // Check if bin name already exists in this warehouse
  if (warehouse.bins.some((bin) => bin.name === binName)) {
    return res
      .status(400)
      .json({ msg: "Bin already exists in this warehouse" });
  }

  warehouse.bins.push({ name: binName, capacity });
  await warehouse.save();

  res.status(200).json({ msg: "Bin added successfully", warehouse });
};

// 📌 Update bin capacity
export const updateBin = async (req, res) => {
  const { warehouseId, binId } = req.params;
  const { capacity, binName } = req.body;

  const warehouse = await Warehouse.findById(warehouseId);
  if (!warehouse) return res.status(404).json({ msg: "Warehouse not found" });

  // Use .id() to get the subdocument
  const bin = warehouse.bins.id(binId);
  if (!bin) return res.status(404).json({ msg: "Bin not found" });

  // Update fields
  if (binName) bin.name = binName;
  if (capacity !== undefined) bin.capacity = capacity;

  await warehouse.save();
  res.status(200).json({ msg: "Bin updated successfully", bin });
};

// 📌 Get bin by ID
export const getBinById = async (req, res) => {
  const { warehouseId, binId } = req.params;

  const warehouse = await Warehouse.findById(warehouseId);
  if (!warehouse) return res.status(404).json({ msg: "Warehouse not found" });

  const bin = warehouse.bins.id(binId);
  if (!bin) return res.status(404).json({ msg: "Bin not found" });

  res.status(200).json(bin);
};
 
