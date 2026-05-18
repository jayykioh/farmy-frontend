import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class PlantDiagnosis {
  @Prop({ required: true })
  disease: string;

  @Prop({ required: true, type: Number })
  confidence: number;

  @Prop({ type: [String], default: [] })
  symptoms: string[];

  @Prop({ type: [String], default: [] })
  treatment: string[];

  @Prop()
  phiWarning?: string;

  @Prop()
  safetyAlert?: string;

  @Prop()
  lowConfidenceWarning?: string;

  @Prop({ type: [String], default: [] })
  similarCases: string[];
}

const PlantDiagnosisSchema = SchemaFactory.createForClass(PlantDiagnosis);

@Schema({
  collection: 'plant_scans',
  timestamps: true,
})
export class PlantScan extends Document {
  @Prop({ required: true })
  userId: string; // UUID string

  @Prop({ required: true })
  imageUrl: string; // R2 signed URL

  @Prop({ required: true })
  pHash: string;

  @Prop({ required: true })
  cropType: string;

  @Prop({ type: PlantDiagnosisSchema, required: true })
  diagnosis: PlantDiagnosis;

  @Prop({ default: 'gemini-flash-vision' })
  modelUsed: string;

  @Prop({ required: true })
  visionPromptVersion: string;

  @Prop({ default: false })
  userConfirmed: boolean;

  @Prop()
  feedback: string; // e.g., 'accurate', 'inaccurate'

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const PlantScanSchema = SchemaFactory.createForClass(PlantScan);

// Indexes
PlantScanSchema.index({ userId: 1, createdAt: -1 });
PlantScanSchema.index({ pHash: 1 });
