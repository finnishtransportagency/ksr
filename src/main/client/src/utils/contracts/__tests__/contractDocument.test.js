import { getContractDocumentUrl } from '../contractDocument';

describe('contractDocument.js', () => {
    it('getContractDocumentUrl - should return tiimeri link', () => {
        const attributes1 = {
            contractNumber: 123,
            diarNumber: 'LIVI/456/789/963',
        };

        const attributes2 = {
            diarNumber: 'LIVI/456/789/963',
        };

        expect(getContractDocumentUrl('tiimeri', 'contractNumber', attributes1))
            .toBe('http://testurl/ksr/api/contract-document?documentType=tiimeri&searchValue=123');
        expect(getContractDocumentUrl('tiimeri', 'diarNumber', attributes1))
            .toBe('http://testurl/ksr/api/contract-document?documentType=tiimeri&searchValue=LIVI/456/789/963');
        expect(getContractDocumentUrl('tiimeri', 'contractNumber,diarNumber', attributes1))
            .toBe('http://testurl/ksr/api/contract-document?documentType=tiimeri&searchValue=123');
        expect(getContractDocumentUrl('tiimeri', 'contractNumber,diarNumber', attributes2))
            .toBe('http://testurl/ksr/api/contract-document?documentType=tiimeri&searchValue=LIVI/456/789/963');
    });

    it('getContractDocumentUrl - should return caseManagement link', () => {
        const attributes1 = {
            contractNumber: 123,
            diarNumber: 'LIVI/456/789/963',
        };

        const attributes2 = {
            diarNumber: 'LIVI/456/789/963',
        };

        expect(getContractDocumentUrl('caseManagement', 'contractNumber', attributes1))
            .toBe('http://testurl/ksr/api/contract-document?documentType=caseManagement&searchValue=123');
        expect(getContractDocumentUrl('caseManagement', 'diarNumber', attributes1))
            .toBe('http://testurl/ksr/api/contract-document?documentType=caseManagement&searchValue=LIVI/456/789/963');
        expect(getContractDocumentUrl('caseManagement', 'contractNumber,diarNumber', attributes1))
            .toBe('http://testurl/ksr/api/contract-document?documentType=caseManagement&searchValue=123');
        expect(getContractDocumentUrl('caseManagement', 'contractNumber,diarNumber', attributes2))
            .toBe('http://testurl/ksr/api/contract-document?documentType=caseManagement&searchValue=LIVI/456/789/963');
    });

    it('getContractDocumentUrl - should return null', () => {
        const attributes1 = {
            contractNumber: 123,
            diarNumber: 'LIVI/456/789/963',
        };

        expect(getContractDocumentUrl('caseManagement', 'somerandomname', attributes1)).toBe(null);
        expect(getContractDocumentUrl(123456, 'diarNumber', attributes1)).toBe(null);
        expect(getContractDocumentUrl('caseManagement', 'contractNumber,diarNumber', {})).toBe(null);
        expect(getContractDocumentUrl('', '', {})).toBe(null);
    });
});
