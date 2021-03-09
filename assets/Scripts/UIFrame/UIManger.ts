
export class UIManger {
    private static instance: UIManger | null = null;
    
    public static get Instance(): UIManger {
        if (UIManger.instance == null) {
            UIManger.instance = new UIManger();
        }
        return UIManger.instance;
    }
}