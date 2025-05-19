// src/types.ts
// Updated to match the new vulnerability finding array format
export interface VulnerabilityFinding {
  vulnerability_id: string;
  category: string;
  subcategory: string;
  severity_suggestion: string;
  location_or_evidence: string;
  description: string;
  remediation_suggestion: string;
}
