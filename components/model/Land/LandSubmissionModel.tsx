
// Types and helper functions for land submission payloads

export type CoordinateType = 'plot' | 'inner_area' | 'land_area' | 'plot_manual' | string;
export type ReferencePointType =
    | 'sw_mark'
    | 'n_corner'
    | 'e_corner'
    | 'n_mark'
    | 'intersection'
    | 'e_mark'
    | string;

export interface LandMeasurementInfo {
    n_corner_dist?: number | null;
    e_corner_dist?: number | null;
    n_mark_dist?: number | null;
    e_mark_dist?: number | null;

    // optional side lengths (adjustment fields from your example)
    sw_se?: number | null;
    se_ne?: number | null;
    ne_nw?: number | null;
    nw_sw?: number | null;
}

export interface LandSuitabilityRemark {
  land_suitability_id: number | string;
  remarks: string;
}

export interface LandCoordinatePoint {
    coordinate_type: CoordinateType;
    latitude: string;
    longitude: string;
}

export interface LandReferencePoint {
    point_type: ReferencePointType;
    latitude: string;
    longitude: string;
}

export interface LandSubmissionModel {
    farmer_id: number;
    // land_code can be generated when missing
    land_code?: string;

    area_in_acre: number;
   
    ownership_type: string;

   

    // can be multiple suitability ids (checkboxes)
    land_suitability_details: LandSuitabilityRemark[]; //this is accurate
    //  land_suitability_details: string;  // this is for way around

    land_name: string;
    image?: string | null; // base64 data uri or file reference
 
    land_measurement_info: LandMeasurementInfo;
    land_coordinate_point: LandCoordinatePoint[];
    land_reference_point: LandReferencePoint[];
}

/**
 * Generate a simple unique land code.
 * Format: LAND-{farmerId}-{timestamp}
 */
export function generateLandCode(farmerId?: number | null): string {
    const fid = typeof farmerId === 'number' ? String(farmerId) : 'UNKNOWN';
    return `LAND-${fid}-${Date.now()}`;
}

/**
 * Ensure incoming partial payload conforms to LandSubmissionModel shape,
 * fill sensible defaults and normalize fields (e.g. ensure land_suitability_id is an array).
 */
export function normalizeLandSubmission(
    input: Partial<LandSubmissionModel>
): LandSubmissionModel {
    const now = new Date().toISOString();

    // normalize land_suitability_details to always be an array of objects
    const land_suitability_details: LandSuitabilityRemark[] = Array.isArray(input.land_suitability_details)
        ? input.land_suitability_details.map(detail => ({
             land_suitability_id: detail.land_suitability_id,
             remarks: detail.remarks,
         }))        
         : [];

    // defensive defaults for nested objects
    const measurement: LandMeasurementInfo = {
        n_corner_dist: input.land_measurement_info?.n_corner_dist ?? null,
        e_corner_dist: input.land_measurement_info?.e_corner_dist ?? null,
        n_mark_dist: input.land_measurement_info?.n_mark_dist ?? null,
        e_mark_dist: input.land_measurement_info?.e_mark_dist ?? null,
        sw_se: input.land_measurement_info?.sw_se ?? null,
        se_ne: input.land_measurement_info?.se_ne ?? null,
        ne_nw: input.land_measurement_info?.ne_nw ?? null,
        nw_sw: input.land_measurement_info?.nw_sw ?? null,
    };

    const coords: LandCoordinatePoint[] = (input.land_coordinate_point ?? []).map(c => ({
        coordinate_type: c.coordinate_type,
        latitude: c.latitude,
        longitude: c.longitude,
    }));

    const refs: LandReferencePoint[] = (input.land_reference_point ?? []).map(r => ({
        point_type: r.point_type,
        latitude: r.latitude,
        longitude: r.longitude,
    }));

    return {
        farmer_id: input.farmer_id ?? 0,
        land_code: input.land_code ?? generateLandCode(input.farmer_id ?? null),
        area_in_acre: input.area_in_acre ?? 0,
 
        ownership_type: input.ownership_type ?? 'Owned',
       
    
        land_suitability_details: land_suitability_details,
        land_name: input.land_name ?? 'Unnamed Land',
        image: input.image ?? null,
       
        land_measurement_info: measurement,
        land_coordinate_point: coords,
        land_reference_point: refs,
    };
}

/**
 * Basic validation for required fields. Returns an array of error messages.
 */
export function validateLandSubmission(model: Partial<LandSubmissionModel>): string[] {
    const errors: string[] = [];

    if (typeof model.farmer_id !== 'number' || isNaN(model.farmer_id)) {
        errors.push('farmer_id is required and must be a number.');
    }
    if (typeof model.area_in_acre !== 'number' || isNaN(model.area_in_acre) || model.area_in_acre <= 0) {
        errors.push('area_in_acre is required and must be a positive number.');
    }
    if (!model.ownership_type || typeof model.ownership_type !== 'string') {
        errors.push('ownership_type is required.');
    }
    if (!model.land_name || typeof model.land_name !== 'string') {
        errors.push('land_name is required.');
    }
    const suitability = model.land_suitability_details;
    if (!suitability || (Array.isArray(suitability) && suitability.length === 0)) {
        errors.push('land_suitability_details is required (at least one detail).');
    }
    if (!Array.isArray(model.land_coordinate_point) || model.land_coordinate_point.length === 0) {
        errors.push('land_coordinate_point must contain at least one coordinate.');
    }
    if (!Array.isArray(model.land_reference_point) || model.land_reference_point.length === 0) {
        errors.push('land_reference_point must contain at least one reference point.');
    }

    return errors;
}