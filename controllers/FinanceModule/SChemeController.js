import Scheme from "../../models/FinanceModule/SchemeModel.js";

// Create a scheme template
export const createScheme = async (req, res) => {
  try {
    const scheme = await Scheme.create(req.body);
    res.status(201).json({ msg: "Scheme created successfully", scheme });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to create scheme" });
  }
};

// Get all schemes (for admin/templates)
export const getAllSchemes = async (req, res) => {
  try {
    const schemes = await Scheme.find();
    res.status(200).json({ schemes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch schemes" });
  }
};

// Get schemes dynamically based on loan amount (for user)
export const getSchemesForLoan = async (req, res) => {
  try {
    const { loanAmount, downPayment } = req.query;

    if (!loanAmount)
      return res.status(400).json({ msg: "Loan amount required" });

    let schemes = await Scheme.find();

    schemes = schemes.map((scheme) => {
      const principal = loanAmount - (downPayment || scheme.downPayment || 0);
      const [tenorMonths] = scheme.grossAdvTenor.split("/"); // e.g., "12/4"
      const n = parseInt(tenorMonths);

      const monthlyRate = scheme.roi / 100 / 12;
      const emi =
        (principal * monthlyRate * (1 + monthlyRate) ** n) /
        ((1 + monthlyRate) ** n - 1);

      const processingFee = (loanAmount * scheme.processingFeePercent) / 100;
      const dbdValue = (loanAmount * scheme.dbdPercent) / 100;

      return {
        ...scheme._doc,
        emi: Math.round(emi),
        processingFee: Math.round(processingFee),
        dbd: `₹${Math.round(dbdValue)} / ${scheme.dbdPercent}%`,
      };
    });

    res.status(200).json({ schemes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching schemes" });
  }
};

// Get single scheme
export const getScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ msg: "Scheme not found" });
    res.status(200).json({ scheme });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch scheme" });
  }
};

// Update scheme
export const updateScheme = async (req, res) => {
  try {
    const updatedScheme = await Scheme.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ msg: "Scheme updated successfully", updatedScheme });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to update scheme" });
  }
};

// Delete scheme
export const deleteScheme = async (req, res) => {
  try {
    await Scheme.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Scheme deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to delete scheme" });
  }
};