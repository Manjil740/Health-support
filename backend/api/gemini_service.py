"""
Gemini AI Service for Healthcare Consultations
"""
import google.generativeai as genai
from django.conf import settings
from typing import Dict, Optional
import logging

logger = logging.getLogger(__name__)


class GeminiHealthcareService:
    """Service class for interacting with Gemini AI for healthcare consultations"""
    
    # Default system prompt for medical AI assistance
    DEFAULT_SYSTEM_PROMPT = """You are a compassionate and knowledgeable AI medical assistant designed to help patients understand their health concerns. Your role is to:

1. PROVIDE PRELIMINARY GUIDANCE: Offer initial insights based on symptoms described, but always emphasize that you're not a replacement for professional medical diagnosis.

2. ASK RELEVANT QUESTIONS: When symptoms are vague, ask clarifying questions about:
   - Duration and severity of symptoms
   - Associated symptoms
   - Medical history relevance
   - Recent changes in lifestyle or medication
   - Any triggers or patterns noticed

3. SUGGEST NEXT STEPS: Based on symptoms, recommend whether to:
   - Monitor symptoms at home with self-care measures
   - Schedule a routine doctor appointment
   - Seek urgent care
   - Go to emergency room (if severe symptoms)

4. PROVIDE HEALTH EDUCATION: Explain conditions in simple, understandable terms and suggest general preventive measures.

5. PRESCRIPTION ANALYSIS: When analyzing prescriptions or medications:
   - Explain the purpose of each medication
   - Note potential side effects
   - Highlight important usage instructions
   - Identify any potential drug interactions
   - Suggest questions to ask the prescribing doctor

6. SAFETY GUIDELINES:
   - Always include disclaimers about seeking professional medical advice
   - Never diagnose specific conditions definitively
   - Don't recommend stopping prescribed medications
   - Escalate serious symptoms to immediate medical care
   - Be culturally sensitive and non-judgmental

7. EMPATHY AND SUPPORT: Use compassionate language and acknowledge patient concerns while maintaining professional boundaries.

IMPORTANT LIMITATIONS:
- You cannot diagnose medical conditions
- You cannot prescribe medications
- You cannot replace emergency services
- You cannot provide personalized medical advice without proper medical evaluation
- Always recommend consulting healthcare professionals for definitive diagnosis and treatment

Format your responses in a clear, structured way with:
- Summary of understanding
- Initial assessment
- Recommendations
- When to seek medical care
- Questions for the patient to consider

Remember: Your goal is to educate, guide, and support patients while directing them to appropriate medical care when needed."""

    def __init__(self):
        """Initialize Gemini AI service"""
        self.api_key = settings.GEMINI_API_KEY
        if not self.api_key:
            logger.warning("Gemini API key not configured")
            self.model = None
        else:
            try:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel('gemini-pro')
            except Exception as e:
                logger.error(f"Error initializing Gemini AI: {str(e)}")
                self.model = None
    
    def is_configured(self) -> bool:
        """Check if Gemini AI is properly configured"""
        return self.model is not None
    
    def analyze_symptoms(
        self, 
        symptoms: str, 
        patient_context: Optional[Dict] = None,
        custom_prompt: Optional[str] = None
    ) -> Dict[str, any]:
        """
        Analyze patient symptoms using Gemini AI
        
        Args:
            symptoms: Patient's description of symptoms
            patient_context: Optional dict with patient info (age, gender, medical history)
            custom_prompt: Optional custom system prompt (defaults to DEFAULT_SYSTEM_PROMPT)
        
        Returns:
            Dict containing AI response, confidence score, and recommendations
        """
        if not self.is_configured():
            return {
                'success': False,
                'error': 'Gemini AI is not configured. Please add GEMINI_API_KEY to environment variables.',
                'response': None,
                'confidence_score': 0.0
            }
        
        try:
            # Build the context
            context_info = ""
            if patient_context:
                context_info = "\n\nPatient Context:\n"
                if patient_context.get('age'):
                    context_info += f"- Age: {patient_context['age']}\n"
                if patient_context.get('gender'):
                    context_info += f"- Gender: {patient_context['gender']}\n"
                if patient_context.get('medical_history'):
                    context_info += f"- Medical History: {patient_context['medical_history']}\n"
                if patient_context.get('current_medications'):
                    context_info += f"- Current Medications: {patient_context['current_medications']}\n"
            
            # Construct the full prompt
            system_prompt = custom_prompt or self.DEFAULT_SYSTEM_PROMPT
            full_prompt = f"""{system_prompt}

{context_info}

Patient's Symptoms/Query:
{symptoms}

Please provide a comprehensive response following the guidelines above."""

            # Generate response
            response = self.model.generate_content(full_prompt)
            
            # Extract confidence score (this is a simplified approach)
            # In production, you might want more sophisticated confidence scoring
            confidence_score = 0.7  # Default confidence
            
            if response and response.text:
                # Simple heuristic: longer, more detailed responses might indicate higher confidence
                word_count = len(response.text.split())
                if word_count > 200:
                    confidence_score = 0.85
                elif word_count > 100:
                    confidence_score = 0.75
                else:
                    confidence_score = 0.65
            
            return {
                'success': True,
                'response': response.text if response else "No response generated",
                'confidence_score': confidence_score,
                'error': None
            }
            
        except Exception as e:
            logger.error(f"Error in Gemini AI analysis: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'response': None,
                'confidence_score': 0.0
            }
    
    def analyze_prescription(
        self,
        prescription_text: str,
        patient_age: Optional[int] = None
    ) -> Dict[str, any]:
        """
        Analyze a prescription and provide insights
        
        Args:
            prescription_text: Text of the prescription
            patient_age: Optional patient age for age-specific guidance
        
        Returns:
            Dict containing analysis and recommendations
        """
        if not self.is_configured():
            return {
                'success': False,
                'error': 'Gemini AI is not configured.',
                'response': None
            }
        
        age_context = f"\nPatient Age: {patient_age}" if patient_age else ""
        
        prompt = f"""{self.DEFAULT_SYSTEM_PROMPT}

Please analyze the following prescription and provide:
1. Explanation of each medication and its purpose
2. Important usage instructions
3. Potential side effects to watch for
4. Any dietary or activity restrictions
5. Questions the patient should ask their doctor
{age_context}

Prescription:
{prescription_text}

Provide a clear, patient-friendly analysis."""

        try:
            response = self.model.generate_content(prompt)
            return {
                'success': True,
                'response': response.text if response else "No response generated",
                'error': None
            }
        except Exception as e:
            logger.error(f"Error analyzing prescription: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'response': None
            }
    
    def get_health_education(self, topic: str) -> Dict[str, any]:
        """
        Get educational content about a health topic
        
        Args:
            topic: Health topic to explain
        
        Returns:
            Dict containing educational content
        """
        if not self.is_configured():
            return {
                'success': False,
                'error': 'Gemini AI is not configured.',
                'response': None
            }
        
        prompt = f"""Provide clear, accurate, and patient-friendly educational content about: {topic}

Include:
1. What it is (simple definition)
2. Common causes or risk factors
3. Typical symptoms or signs
4. Prevention measures
5. When to see a doctor
6. General management approaches

Keep the language simple and accessible to general audiences. Include relevant disclaimers about seeking professional medical advice."""

        try:
            response = self.model.generate_content(prompt)
            return {
                'success': True,
                'response': response.text if response else "No response generated",
                'error': None
            }
        except Exception as e:
            logger.error(f"Error getting health education: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'response': None
            }


# Singleton instance
gemini_service = GeminiHealthcareService()